from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Create an SQLAlchemy engine to connect to SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./userdata.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declare a base
Base = declarative_base()

# Define User model
# Define User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String, index=True)
    userName = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phoneNumber = Column(String)
    password = Column(String)
    confirmPassword = Column(String)
    gender = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)
