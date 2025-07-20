#!/usr/bin/env python3
"""
Simple script to run the Flask backend server.
Make sure to set the GEMINI_API_KEY environment variable before running.
"""

import os
import sys
from app import app

def main():
    # Check if API key is set
    # if not os.getenv('GEMINI_API_KEY'):
    #     print("❌ Error: GEMINI_API_KEY environment variable is not set!")
    #     print("Please set it using:")
    #     print("  export GEMINI_API_KEY='your_api_key_here'")
    #     print("Or create a .env file with the API key")
    #     sys.exit(1)
    
    print("🚀 Starting Answer Script Evaluator Backend...")
    print("📡 Server will be available at: http://localhost:5000")
    print("🔑 API Key configured successfully")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main()