import uvicorn
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Check if OpenAI API key is set
if not os.getenv("OPENAI_API_KEY"):
    print("⚠️  WARNING: OPENAI_API_KEY environment variable is not set!")
    print("Please set your OpenAI API key in a .env file or environment variables.")
    print("Example: OPENAI_API_KEY=sk-...")
    exit(1)

print("🚀 Starting Sense AI Chatbot API server...")
print("📂 Documents will be stored in the 'uploads' directory")
print("🔗 URLs will be stored in the 'urls' directory")
print("🧠 Vector stores will be created in the 'vectorstores' directory")

# Run the FastAPI server
uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# Note: This script assumes main.py is in the same directory

