
from __future__ import annotations
import asyncio
from typing import TYPE_CHECKING, Any, Dict, List
from langchain_core.callbacks.base import BaseCallbackHandler

if TYPE_CHECKING:
    from langchain_core.agents import AgentAction, AgentFinish
    from langchain_core.messages import BaseMessage
    from langchain_core.outputs import LLMResult


from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.prompts import ChatPromptTemplate
# from langchain_openai import ChatOpenAI


# class MyCustomHandler(BaseCallbackHandler):
#     def on_llm_new_token(self, token: str, **kwargs) -> None:
#         print(f"My custom handler, token: {token}")
#


def create_specified_query(data: dict):
    message = data['message']
    if data['tabId'] == 'content-summarizer':
        context = """
         You are a very helpful assistant and your only job is to  `Summarize Code snippets of Python and Java programming language`.
         ###Instructions:\n
         * If the code provided by user is not in Python or JAVA language don't do that as its not your job.
         * If you get codes of Python or Java language you must do your job to your best knowledge and effort.
         ### Preivious Chat History:\n
            {chat_history}
         ### User's Question:\n
         ```{message}```
        """
        return context
    elif data['tabId'] == 'content-error':
        context = """
         You are a very helpful assistant and your only job is to  `Detect errors in code snippets of Python and JAVA programming language`.
         ###Instructions:\n
         * If the code provided by user is not in Python or JAVA language don't do that as its not your job.
         * If you get codes of Python or Java language you must do your job to your best knowledge and effort.
         ### Preivious Chat History:\n
            {chat_history}
         ### User's Question:\n
         ```{message}```
        """
        return context
    elif data['tabId'] == 'content-comment':
        context = """
         You are a very helpful assistant and your only job is to  `Provide comments to code snippets of Python and JAVA programming language`.
         ###Instructions:\n
         * If the code provided by user is not in Python or JAVA language don't do that as its not your job.
         * If you get codes of Python or Java language you must do your job to your best knowledge and effort.
         ### Preivious Chat History:\n
            {chat_history}
         ### User's Question:\n
         ```{message}```
        """
        return context
    elif data['tabId'] == 'content-customize':
        context = """
         You are a very helpful assistant and your only job is to  `Customize the code snippets of Python and JAVA programming language`.
         ###Instructions:\n
         * If the code provided by user is not in Python or JAVA language don't do that as its not your job.
         * If you get codes of Python or Java language you must do your job to your best knowledge and effort.
         ### Preivious Chat History:\n
            {chat_history}
         ### User's Question:\n
         ```{message}```
        """
        return context
        
