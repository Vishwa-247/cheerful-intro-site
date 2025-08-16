from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add parent directories to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from shared.database.connection import init_database, close_database, get_courses_collection, get_chapters_collection
from shared.models.schemas import Course, Chapter, CourseGenerationRequest, CourseGenerationResponse, APIResponse
import google.generativeai as genai
import json
import asyncio
from datetime import datetime
from bson import ObjectId
import uuid

app = FastAPI(title="Course Generation Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')

@app.on_event("startup")
async def startup_event():
    await init_database()

@app.on_event("shutdown")
async def shutdown_event():
    await close_database()

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc

async def generate_course_content_with_ai(topic: str, purpose: str, difficulty: str):
    """Generate enhanced course content with mind maps and notebook features using Gemini AI"""
    
    prompt = f"""
    You are an expert curriculum designer AI for StudyMate Agentic LMS platform. Generate a comprehensive course on "{topic}" for {purpose} preparation at {difficulty} level.

    The output MUST be a single, valid JSON object with structured learning aids. Do not include any text outside of the JSON.

    Generate content using this enhanced JSON structure:
    {{
        "topic": "{topic}",
        "summary": "A brief 2-3 sentence summary of what the course covers",
        "mainContent": {{
            "introduction": "An engaging introduction to the topic with real-world context",
            "sections": [
                {{
                    "title": "Section title",
                    "content": "Detailed explanation with practical examples and applications",
                    "examples": ["Real example 1 with code/scenario", "Real example 2 with implementation"],
                    "keyPoints": ["Key insight 1", "Key insight 2"],
                    "codeSnippets": [
                        {{
                            "language": "javascript|python|sql|etc",
                            "code": "// Practical code example\nfunction example() {{ return 'working code'; }}",
                            "explanation": "What this code demonstrates"
                        }}
                    ]
                }}
            ]
        }},
        "chapters": [
            {{
                "title": "Chapter 1 Title",
                "content": "Comprehensive chapter content with markdown formatting and examples",
                "order_number": 1,
                "duration_minutes": 30,
                "learning_objectives": ["Specific objective 1", "Specific objective 2"],
                "mindMapSection": {{
                    "name": "Chapter Topic",
                    "children": [
                        {{
                            "name": "Key Concept 1",
                            "children": [{{"name": "Detail 1.1"}}, {{"name": "Detail 1.2"}}]
                        }}
                    ]
                }}
            }}
        ],
        "notebook": {{
            "keyConcepts": [
                {{
                    "term": "Technical Term 1",
                    "definition": "Clear, concise definition with context",
                    "importance": "Why this concept matters",
                    "examples": ["Example usage 1", "Example usage 2"]
                }},
                {{
                    "term": "Technical Term 2", 
                    "definition": "Another important concept definition",
                    "importance": "Practical significance",
                    "examples": ["Real-world application"]
                }}
            ],
            "analogies": [
                {{
                    "concept": "Complex technical concept",
                    "analogy": "Simple real-world comparison that makes it easy to understand",
                    "explanation": "How the analogy maps to the technical concept"
                }}
            ],
            "practicalTips": [
                "Actionable tip 1 for applying this knowledge",
                "Best practice 2 for real-world use",
                "Common pitfall to avoid"
            ]
        }},
        "flashcards": [
            {{
                "question": "What is the key difference between X and Y?",
                "answer": "Concise but complete answer with context",
                "difficulty": "{difficulty}",
                "category": "concepts|implementation|theory|practice"
            }}
        ],
        "mcqs": [
            {{
                "question": "Which approach is best for solving X problem?",
                "options": ["Detailed option A", "Detailed option B", "Detailed option C", "Detailed option D"],
                "correct_answer": "Detailed option A",
                "explanation": "Comprehensive explanation of why this is correct and others are wrong",
                "difficulty": "{difficulty}"
            }}
        ],
        "qnas": [
            {{
                "question": "How would you handle X situation in real-world projects?",
                "answer": "Detailed practical answer with examples, considerations, and best practices"
            }}
        ],
        "mindMap": {{
            "root": {{
                "name": "{topic}",
                "type": "root",
                "children": [
                    {{
                        "name": "Core Concepts",
                        "type": "concept",
                        "children": [
                            {{
                                "name": "Fundamental Principle 1",
                                "type": "principle",
                                "children": [
                                    {{"name": "Implementation Detail 1", "type": "detail"}},
                                    {{"name": "Use Case 1", "type": "example"}}
                                ]
                            }},
                            {{
                                "name": "Fundamental Principle 2", 
                                "type": "principle",
                                "children": [
                                    {{"name": "Implementation Detail 2", "type": "detail"}},
                                    {{"name": "Use Case 2", "type": "example"}}
                                ]
                            }}
                        ]
                    }},
                    {{
                        "name": "Practical Applications",
                        "type": "application",
                        "children": [
                            {{
                                "name": "Real-world Scenario 1",
                                "type": "scenario",
                                "children": [
                                    {{"name": "Solution Approach", "type": "solution"}},
                                    {{"name": "Expected Outcome", "type": "outcome"}}
                                ]
                            }}
                        ]
                    }},
                    {{
                        "name": "Best Practices",
                        "type": "best-practice",
                        "children": [
                            {{"name": "Performance Optimization", "type": "optimization"}},
                            {{"name": "Common Pitfalls", "type": "warning"}},
                            {{"name": "Testing Strategies", "type": "testing"}}
                        ]
                    }}
                ]
            }}
        }},
        "resources": [
            {{
                "title": "Official {topic} Documentation",
                "type": "documentation",
                "url": "https://docs.example.com",
                "description": "Comprehensive official guide",
                "difficulty": "{difficulty}"
            }},
            {{
                "title": "Interactive {topic} Tutorial",
                "type": "tutorial",
                "url": "https://tutorial.example.com", 
                "description": "Hands-on learning experience",
                "difficulty": "{difficulty}"
            }}
        ],
        "assessments": {{
            "quizzes": [
                {{
                    "title": "Chapter 1 Quick Check",
                    "questions": ["question_id_1", "question_id_2"],
                    "estimated_minutes": 10
                }}
            ],
            "projects": [
                {{
                    "title": "Build a {topic} Project",
                    "description": "Apply what you've learned in a practical project",
                    "requirements": ["Requirement 1", "Requirement 2"],
                    "estimated_hours": 5
                }}
            ]
        }}
    }}

    Ensure the content is:
    - Appropriate for {difficulty} level learners
    - Focused on {purpose} preparation  
    - Includes rich mind map structure with different node types
    - Contains practical analogies and key concepts for notebook-style learning
    - Has actionable code examples and real-world applications
    - Include at least 3 chapters, 15 flashcards, 15 MCQs, and 8 Q&As
    - Mind map should have at least 3 main branches with 2-3 levels of depth
    """

    try:
        if GEMINI_API_KEY and model:
            response = model.generate_content(prompt)
            content_text = response.text.strip()
            
            # Clean up the response to extract JSON
            if content_text.startswith("```json"):
                content_text = content_text[7:]
            if content_text.endswith("```"):
                content_text = content_text[:-3]
            
            parsed_content = json.loads(content_text)
            return parsed_content
        else:
            # Fallback content for development
            return generate_fallback_content(topic, purpose, difficulty)
    except Exception as e:
        print(f"Error generating content with AI: {e}")
        return generate_fallback_content(topic, purpose, difficulty)

def generate_fallback_content(topic: str, purpose: str, difficulty: str):
    """Generate enhanced fallback content with mind maps and notebook features when AI is not available"""
    return {
        "topic": topic,
        "summary": f"A comprehensive {difficulty} level course on {topic} designed for {purpose} preparation with interactive mind maps and structured learning aids.",
        "mainContent": {
            "introduction": f"Welcome to this enhanced {difficulty} level course on {topic}. This course uses agentic AI to provide personalized learning with mind maps, key concepts, and practical applications specifically designed for {purpose}.",
            "sections": [
                {
                    "title": f"Introduction to {topic}",
                    "content": f"This section provides a foundational understanding of {topic} concepts and principles with real-world context.",
                    "examples": [f"Basic {topic} implementation example", f"Real-world {topic} use case"],
                    "keyPoints": [f"Core principle 1 of {topic}", f"Essential concept 2 of {topic}"],
                    "codeSnippets": [
                        {
                            "language": "javascript",
                            "code": f"// Example {topic} implementation\nfunction example{topic.replace(' ', '')}() {{\n  return 'Working example';\n}}",
                            "explanation": f"Basic {topic} implementation pattern"
                        }
                    ]
                },
                {
                    "title": f"Advanced {topic} Concepts",
                    "content": f"Dive deeper into advanced {topic} topics with practical applications and best practices.",
                    "examples": [f"Advanced {topic} pattern", f"Complex {topic} architecture"],
                    "keyPoints": [f"Advanced pattern 1", f"Optimization technique 2"],
                    "codeSnippets": [
                        {
                            "language": "javascript", 
                            "code": f"// Advanced {topic} pattern\nclass Advanced{topic.replace(' ', '')} {{\n  constructor() {{\n    this.optimized = true;\n  }}\n}}",
                            "explanation": f"Advanced {topic} implementation with optimization"
                        }
                    ]
                }
            ]
        },
        "chapters": [
            {
                "title": f"Fundamentals of {topic}",
                "content": f"# Fundamentals of {topic}\n\nLearn the basic principles and concepts of {topic}. This chapter covers essential knowledge needed for {purpose}.\n\n## Key Learning Outcomes\n- Understand core {topic} concepts\n- Apply fundamental principles\n- Build foundation for advanced topics",
                "order_number": 1,
                "duration_minutes": 45,
                "learning_objectives": [f"Understand basic {topic} concepts", f"Apply {topic} principles", "Build strong foundation"],
                "mindMapSection": {
                    "name": f"{topic} Fundamentals",
                    "children": [
                        {
                            "name": "Core Concepts",
                            "children": [{"name": "Concept 1"}, {"name": "Concept 2"}]
                        },
                        {
                            "name": "Basic Implementation",
                            "children": [{"name": "Setup"}, {"name": "Configuration"}]
                        }
                    ]
                }
            },
            {
                "title": f"Practical {topic} Applications",
                "content": f"# Practical {topic} Applications\n\nExplore real-world applications of {topic} with hands-on examples and case studies.\n\n## What You'll Learn\n- Real-world implementation patterns\n- Best practices and common pitfalls\n- Industry-standard approaches",
                "order_number": 2,
                "duration_minutes": 60,
                "learning_objectives": [f"Apply {topic} in practice", "Solve real-world problems", "Implement best practices"],
                "mindMapSection": {
                    "name": f"{topic} Applications",
                    "children": [
                        {
                            "name": "Use Cases",
                            "children": [{"name": "Enterprise"}, {"name": "Startups"}]
                        },
                        {
                            "name": "Implementation",
                            "children": [{"name": "Architecture"}, {"name": "Deployment"}]
                        }
                    ]
                }
            },
            {
                "title": f"Advanced {topic} Techniques",
                "content": f"# Advanced {topic} Techniques\n\nMaster advanced {topic} techniques and best practices for {purpose} success.\n\n## Advanced Topics Covered\n- Performance optimization strategies\n- Scalability considerations\n- Industry best practices",
                "order_number": 3,
                "duration_minutes": 75,
                "learning_objectives": [f"Master advanced {topic}", "Optimize performance", "Scale applications"],
                "mindMapSection": {
                    "name": f"Advanced {topic}",
                    "children": [
                        {
                            "name": "Optimization",
                            "children": [{"name": "Performance"}, {"name": "Memory"}]
                        },
                        {
                            "name": "Scaling",
                            "children": [{"name": "Horizontal"}, {"name": "Vertical"}]
                        }
                    ]
                }
            }
        ],
        "notebook": {
            "keyConcepts": [
                {
                    "term": f"{topic} Architecture",
                    "definition": f"The structural design and organization of {topic} systems",
                    "importance": "Essential for building scalable and maintainable applications",
                    "examples": [f"MVC in {topic}", f"Component-based {topic}"]
                },
                {
                    "term": f"{topic} Best Practices",
                    "definition": f"Industry-standard approaches for implementing {topic} effectively",
                    "importance": "Ensures code quality, performance, and maintainability",
                    "examples": ["Code organization patterns", "Testing strategies"]
                },
                {
                    "term": f"{topic} Performance",
                    "definition": f"Optimization techniques for {topic} applications",
                    "importance": "Critical for user experience and scalability",
                    "examples": ["Lazy loading", "Caching strategies"]
                }
            ],
            "analogies": [
                {
                    "concept": f"{topic} Components",
                    "analogy": "Like LEGO blocks - individual pieces that can be combined to build complex structures",
                    "explanation": f"Just as LEGO blocks have standard connection points, {topic} components have well-defined interfaces that allow them to work together seamlessly"
                },
                {
                    "concept": f"{topic} State Management",
                    "analogy": "Like a library's card catalog system - keeping track of where everything is and its current status",
                    "explanation": f"{topic} state management keeps track of data changes and ensures all parts of the application stay synchronized"
                }
            ],
            "practicalTips": [
                f"Start with small, focused {topic} projects to build understanding",
                f"Always follow {topic} naming conventions for better code readability",
                f"Use version control to track changes in your {topic} projects",
                f"Test your {topic} code frequently to catch issues early",
                f"Document your {topic} code for future reference and team collaboration"
            ]
        },
        "flashcards": [
            {"question": f"What is {topic}?", "answer": f"{topic} is a fundamental technology/concept used for building modern applications.", "difficulty": difficulty, "category": "concepts"},
            {"question": f"Why is {topic} important?", "answer": f"{topic} is important because it enables scalable, maintainable, and efficient application development.", "difficulty": difficulty, "category": "theory"},
            {"question": f"How do you implement {topic}?", "answer": f"{topic} can be implemented using structured approaches, following best practices and design patterns.", "difficulty": difficulty, "category": "implementation"},
            {"question": f"What are the key benefits of {topic}?", "answer": f"Key benefits include improved code organization, better performance, enhanced maintainability, and scalability.", "difficulty": difficulty, "category": "concepts"},
            {"question": f"What are common {topic} patterns?", "answer": f"Common patterns include component composition, state management, and modular architecture.", "difficulty": difficulty, "category": "practice"}
        ],
        "mcqs": [
            {
                "question": f"What is the primary purpose of {topic}?",
                "options": [
                    f"To create efficient and scalable applications",
                    f"To replace all existing technologies", 
                    f"To make coding more complex",
                    f"To slow down development"
                ],
                "correct_answer": f"To create efficient and scalable applications",
                "explanation": f"The primary purpose of {topic} is to provide tools and patterns for building efficient, scalable, and maintainable applications.",
                "difficulty": difficulty
            },
            {
                "question": f"Which approach is best when starting with {topic}?",
                "options": [
                    "Jump directly into complex projects",
                    "Start with small, focused projects",
                    "Memorize all documentation first", 
                    "Skip the fundamentals"
                ],
                "correct_answer": "Start with small, focused projects",
                "explanation": "Starting with small, focused projects allows you to gradually build understanding and confidence before tackling more complex implementations.",
                "difficulty": difficulty
            }
        ],
        "qnas": [
            {
                "question": f"How can I get started with {topic}?",
                "answer": f"To get started with {topic}, begin by understanding the core concepts, follow official documentation, practice with small projects, and gradually work on more complex applications. Join community forums and consider taking structured courses."
            },
            {
                "question": f"What are the most common mistakes beginners make with {topic}?",
                "answer": f"Common mistakes include not following best practices, trying to build complex applications too early, neglecting testing, poor code organization, and not understanding the underlying concepts before implementation."
            },
            {
                "question": f"How do I debug {topic} applications effectively?",
                "answer": f"Use developer tools, implement proper logging, write unit tests, use debugging techniques like breakpoints, and follow systematic approaches to isolate and fix issues."
            }
        ],
        "mindMap": {
            "root": {
                "name": topic,
                "type": "root",
                "children": [
                    {
                        "name": "Core Concepts",
                        "type": "concept",
                        "children": [
                            {
                                "name": "Fundamental Principles",
                                "type": "principle",
                                "children": [
                                    {"name": "Component Architecture", "type": "detail"},
                                    {"name": "Data Flow", "type": "detail"},
                                    {"name": "State Management", "type": "detail"}
                                ]
                            },
                            {
                                "name": "Design Patterns",
                                "type": "principle", 
                                "children": [
                                    {"name": "MVC Pattern", "type": "example"},
                                    {"name": "Observer Pattern", "type": "example"}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Practical Applications",
                        "type": "application",
                        "children": [
                            {
                                "name": "Web Development",
                                "type": "scenario",
                                "children": [
                                    {"name": "Frontend Applications", "type": "solution"},
                                    {"name": "Progressive Web Apps", "type": "solution"}
                                ]
                            },
                            {
                                "name": "Mobile Development",
                                "type": "scenario",
                                "children": [
                                    {"name": "Cross-platform Apps", "type": "solution"},
                                    {"name": "Native Performance", "type": "outcome"}
                                ]
                            }
                        ]
                    },
                    {
                        "name": "Best Practices",
                        "type": "best-practice",
                        "children": [
                            {"name": "Performance Optimization", "type": "optimization"},
                            {"name": "Security Considerations", "type": "warning"},
                            {"name": "Testing Strategies", "type": "testing"},
                            {"name": "Code Organization", "type": "optimization"}
                        ]
                    }
                ]
            }
        },
        "resources": [
            {
                "title": f"Official {topic} Documentation",
                "type": "documentation",
                "url": "https://docs.example.com",
                "description": f"Comprehensive official guide to {topic}",
                "difficulty": difficulty
            },
            {
                "title": f"Interactive {topic} Tutorial",
                "type": "tutorial", 
                "url": "https://tutorial.example.com",
                "description": f"Hands-on learning experience with {topic}",
                "difficulty": difficulty
            },
            {
                "title": f"{topic} Community Forum",
                "type": "community",
                "url": "https://community.example.com",
                "description": f"Connect with other {topic} developers",
                "difficulty": difficulty
            }
        ],
        "assessments": {
            "quizzes": [
                {
                    "title": f"{topic} Fundamentals Quiz",
                    "questions": ["q1", "q2", "q3"],
                    "estimated_minutes": 15
                },
                {
                    "title": f"Practical {topic} Quiz", 
                    "questions": ["q4", "q5", "q6"],
                    "estimated_minutes": 20
                }
            ],
            "projects": [
                {
                    "title": f"Build a {topic} Application",
                    "description": f"Create a practical application using {topic} concepts",
                    "requirements": [
                        f"Implement core {topic} features",
                        f"Follow {topic} best practices",
                        "Include proper documentation"
                    ],
                    "estimated_hours": 8
                }
            ]
        }
    }

@app.post("/generate", response_model=CourseGenerationResponse)
async def generate_course(request: CourseGenerationRequest, background_tasks: BackgroundTasks):
    """Generate a new course"""
    try:
        course_id = str(uuid.uuid4())
        
        # Create initial course document
        course_data = {
            "_id": course_id,
            "user_id": request.dict().get("user_id", "demo_user"),
            "title": request.course_name,
            "purpose": request.purpose,
            "difficulty": request.difficulty,
            "summary": f"AI-generated course on {request.course_name}",
            "content": {
                "status": "generating",
                "message": "Course generation in progress...",
                "last_updated": datetime.utcnow()
            },
            "progress": {
                "current_chapter": 0,
                "completion_percentage": 0.0,
                "last_accessed": datetime.utcnow()
            },
            "adaptations": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        courses_collection = await get_courses_collection()
        await courses_collection.insert_one(course_data)
        
        # Generate content in background
        background_tasks.add_task(
            generate_course_content_background,
            course_id,
            request.course_name,
            request.purpose,
            request.difficulty
        )
        
        return CourseGenerationResponse(
            course_id=course_id,
            status="generating",
            message="Course generation started successfully",
            estimated_completion_time=5
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start course generation: {str(e)}")

async def generate_course_content_background(course_id: str, topic: str, purpose: str, difficulty: str):
    """Background task to generate course content"""
    try:
        # Simulate some processing time
        await asyncio.sleep(2)
        
        # Generate content using AI
        generated_content = await generate_course_content_with_ai(topic, purpose, difficulty)
        
        # Update course with generated content
        courses_collection = await get_courses_collection()
        chapters_collection = await get_chapters_collection()
        
        # Insert chapters
        for chapter_data in generated_content.get("chapters", []):
            chapter_doc = {
                "_id": str(uuid.uuid4()),
                "course_id": course_id,
                "title": chapter_data["title"],
                "content": chapter_data["content"],
                "order_number": chapter_data["order_number"],
                "json_content": {
                    "duration_minutes": chapter_data.get("duration_minutes", 30),
                    "learning_objectives": chapter_data.get("learning_objectives", []),
                    "examples": chapter_data.get("examples", []),
                    "key_points": chapter_data.get("key_points", [])
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await chapters_collection.insert_one(chapter_doc)
        
        # Update course status
        await courses_collection.update_one(
            {"_id": course_id},
            {
                "$set": {
                    "content": {
                        "status": "complete",
                        "message": "Course generated successfully",
                        "last_updated": datetime.utcnow(),
                        "parsed_content": generated_content
                    },
                    "summary": generated_content.get("summary", f"Course on {topic}"),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        print(f"Course {course_id} generated successfully")
        
    except Exception as e:
        # Update course with error status
        courses_collection = await get_courses_collection()
        await courses_collection.update_one(
            {"_id": course_id},
            {
                "$set": {
                    "content": {
                        "status": "error",
                        "message": f"Failed to generate course: {str(e)}",
                        "last_updated": datetime.utcnow()
                    },
                    "updated_at": datetime.utcnow()
                }
            }
        )
        print(f"Error generating course {course_id}: {e}")

@app.get("/courses")
async def get_user_courses(user_id: str):
    """Get all courses for a user"""
    try:
        courses_collection = await get_courses_collection()
        cursor = courses_collection.find({"user_id": user_id}).sort("created_at", -1)
        courses = await cursor.to_list(length=100)
        
        return APIResponse(
            success=True,
            data=serialize_doc(courses)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch courses: {str(e)}")

@app.get("/courses/{course_id}")
async def get_course(course_id: str):
    """Get a specific course"""
    try:
        courses_collection = await get_courses_collection()
        course = await courses_collection.find_one({"_id": course_id})
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        return APIResponse(
            success=True,
            data=serialize_doc(course)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch course: {str(e)}")

@app.get("/courses/{course_id}/content")
async def get_course_content(course_id: str):
    """Get course content including chapters"""
    try:
        courses_collection = await get_courses_collection()
        chapters_collection = await get_chapters_collection()
        
        course = await courses_collection.find_one({"_id": course_id})
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Get chapters
        cursor = chapters_collection.find({"course_id": course_id}).sort("order_number", 1)
        chapters = await cursor.to_list(length=100)
        
        response_data = serialize_doc(course)
        response_data["chapters"] = serialize_doc(chapters)
        
        return APIResponse(
            success=True,
            data=response_data
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch course content: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agent": "course-generation"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)