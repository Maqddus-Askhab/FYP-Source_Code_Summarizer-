import json
from handler import create_specified_query
from fastapi import FastAPI, WebSocket, Request, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import markdown
from langchain_community.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_core.callbacks import BaseCallbackHandler
from fastapi import FastAPI, HTTPException, Depends

from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, User

from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory



load_dotenv()

app = FastAPI(title = "Chatbot Streaming using FastAPI")


class MyCustomHandler(BaseCallbackHandler):
    def on_llm_new_token(self, token: str, **kwargs) -> str:
        print(token, end = '')
        # return token


app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)
llm = Ollama(
    model = "phi3", callback_manager = CallbackManager([MyCustomHandler()])
)




# Notice that we need to align the `memory_key`
summarizer_memory = ConversationBufferMemory(memory_key="chat_history")
comment_memory = ConversationBufferMemory(memory_key="chat_history")
error_memory = ConversationBufferMemory(memory_key="chat_history")
customize_memory = ConversationBufferMemory(memory_key="chat_history")



#--------------------------Database API's--------------------

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint for user signup
from pydantic import BaseModel

# Define Pydantic model for the request body-- schema for creation of user
class UserCreate(BaseModel):
    fullName: str
    userName: str
    email: str
    phoneNumber: str
    password: str
    confirmPassword: str
    gender: str

class UserLogin(BaseModel):
    password: str
    username: str


@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    
    if db.query(User).filter(User.userName == user.userName).first():
       
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == user.email).first():
        
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create a new user
    if user.confirmPassword == user.password:
        new_user = User(
            fullName=user.fullName,
            userName=user.userName,
            email=user.email,
            phoneNumber=user.phoneNumber,
            password=user.password,
            confirmPassword=user.confirmPassword,
            gender=user.gender
        )
        db.add(new_user)
        db.commit()
        print('User created successfully')
        return {"message": "User created successfully"}
    else:
        raise HTTPException(status_code=400, detail="Passwrod does not match.")


@app.post("/login")
def login(login_request: UserLogin, db: Session = Depends(get_db)):
    # Extract username and password from the request body
    username = login_request.username
    password = login_request.password
    
    # Check if the user exists
    user = db.query(User).filter(
        (User.userName == username) | (User.email == username) | (User.phoneNumber == username),
        User.password == password
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return JSONResponse(content={"message": "Login successful"}) 


# --------------------------------chatbot API's----------------

@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print("FRONT END :", data)
            data = json.loads(data)  # Parse the JSON data received
            # tab_id = data['tabId']

            template = create_specified_query(data)
            prompt = PromptTemplate.from_template(template)
            if data['tabId'] == 'content-comment':
                conversation_chain = LLMChain(
                                    llm=llm,
                                    prompt=prompt,
                                    verbose=True,
                                    memory=comment_memory
                                )
            if data['tabId'] == 'content-error':
                conversation_chain = LLMChain(
                                    llm=llm,
                                    prompt=prompt,
                                    verbose=True,
                                    memory=error_memory
                                )
            if data['tabId'] == 'content-summarizer':
                conversation_chain = LLMChain(
                                    llm=llm,
                                    prompt=prompt,
                                    verbose=True,
                                    memory=summarizer_memory
                                )
            if data['tabId'] == 'content-customize':
                conversation_chain = LLMChain(
                                    llm=llm,
                                    prompt=prompt,
                                    verbose=True,
                                    memory=customize_memory
                                )
            
            # conversation_chain = LLMChain(
            #                         llm=llm,
            #                         prompt=prompt,
            #                         verbose=True,
            #                         memory=memory
            #                     )
            print('*'*50)
            # print(f"Received from {tab_id}: {message}")
            await websocket.send_json({'text': 'Processing...', 'overwrite': True})
            # websocket.send_text(data)
            # Process the data through the LLM
            llm_resp = ''
            
            async for event in conversation_chain.astream_events(
                    # prompt,
                    {'message':data['message']},
                    # include_names=["ChatOpenAI"],
                    version = 'v1'
            ):
                print('-_-_-', event)
                kind = event["event"]
                
                if kind == "on_llm_stream":
                    content = event["data"]["chunk"]
                    # print("\nContent type: ",content, type(content))
                    if content:
                        llm_resp += content
                        html_content = markdown.markdown(llm_resp)
                        # print(event, content)
                        custom_html = html_content.replace('<h1>', '<h5>').replace('</h1>', '</h5>')
                        
                        # print('sent . . .', html_content)
                        await websocket.send_json({'text': custom_html, 'overwrite': True})
    except WebSocketDisconnect:
        print("Client disconnected")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(app, host = "localhost", port = 8006)
