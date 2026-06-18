import random
from typing import Optional

class HanzAIEngine:
    def __init__(self):
        self.name = "HanzAI"
        self.version = "1.0.0"
        
        # Knowledge base responses
        self.responses = {
            "greeting": [
                "Halo! 👋 Saya HanzAI, senang bertemu Anda!",
                "Hey! 🎉 Apa kabar? Bagaimana saya bisa membantu Anda?",
                "Selamat datang! 😊 Saya HanzAI, siap membantu Anda dengan apa saja.",
            ],
            "help": [
                "Saya bisa membantu Anda dengan:\n• Menjawab pertanyaan\n• Menulis konten\n• Coding & programming\n• Brainstorming ide\n• Dan banyak lagi!",
            ],
            "about": [
                "Saya adalah HanzAI, AI assistant yang dirancang untuk memberikan respons yang cerdas dan membantu. Saya terinspirasi oleh Gemini dan dioptimalkan untuk pengalaman percakapan yang sempurna.",
            ],
            "default": [
                "Itu menarik! 🤔 Bisa Anda jelaskan lebih detail?",
                "Saya memahami. Mari kita diskusikan lebih lanjut.",
                "Bagus! Ada yang bisa saya bantu lagi?",
            ]
        }
    
    def generate_response(self, user_message: str) -> str:
        """Generate AI response based on user message"""
        message_lower = user_message.lower()
        
        # Greeting detection
        greetings = ["halo", "hi", "hello", "pagi", "siang", "sore", "malam", "apa kabar"]
        if any(greet in message_lower for greet in greetings):
            return random.choice(self.responses["greeting"])
        
        # Help detection
        if any(word in message_lower for word in ["bantu", "help", "bisa apa", "fitur"]):
            return random.choice(self.responses["help"])
        
        # About detection
        if any(word in message_lower for word in ["siapa", "tentang", "about", "kamu siapa"]):
            return random.choice(self.responses["about"])
        
        # Default response with context
        user_preview = user_message[:50] + "..." if len(user_message) > 50 else user_message
        return f"Anda mengatakan: '{user_preview}'\n\n{random.choice(self.responses['default'])}"
    
    async def chat(self, message: str) -> dict:
        """Process chat message and return response"""
        response = self.generate_response(message)
        return {
            "status": "success",
            "ai_name": self.name,
            "response": response,
            "confidence": 0.85
        }

# Initialize AI Engine
hanz_ai = HanzAIEngine()