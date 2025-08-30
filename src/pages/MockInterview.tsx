
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InterviewSetup from "@/components/interview/InterviewSetup";
import VideoRecorder from "@/components/interview/VideoRecorder";
import Container from "@/components/ui/Container";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourseForm from "@/components/course/CourseForm";
import { useToast } from "@/hooks/use-toast";
import { getInterviewData } from "@/data/mockInterviewData";
import EmotionalAnalysisPanel from "@/components/interview/EmotionalAnalysisPanel";
import AdaptiveQuestionEngine from "@/components/interview/AdaptiveQuestionEngine";
import AgentActivityPanel from "@/components/course/AgentActivityPanel";
import ProgressAnalytics from "@/components/course/ProgressAnalytics";
import AgentSelectionPanel from "@/components/interview/AgentSelectionPanel";

const staticQuestions = {
  "Software Engineer": [
    "Tell me about your experience with agile development methodologies.",
    "How do you approach debugging complex issues in your code?",
    "Describe a time when you had to design a scalable web application.",
    "How do you use version control in your workflow?",
    "Tell me about a challenging project you've worked on and how you handled it."
  ],
  "Frontend Developer": [
    "Explain how React hooks work and their advantages over class components.",
    "How do you optimize website performance?",
    "What strategies do you use for responsive design?",
    "How do you approach testing frontend applications?",
    "How do you ensure cross-browser compatibility in your web applications?"
  ],
  "Backend Developer": [
    "How do you design database schemas for scalability?",
    "What security measures do you implement in your APIs?",
    "How have you implemented microservices architecture?",
    "Explain your approach to error handling in a backend application.",
    "How do you handle API versioning?"
  ],
  "Data Scientist": [
    "How do you handle data preparation and cleaning?",
    "Which machine learning algorithms have you used and in what contexts?",
    "How do you validate your models?",
    "How do you translate business problems into data science solutions?",
    "How do you communicate technical findings to non-technical stakeholders?"
  ],
  "DevOps Engineer": [
    "Describe your experience setting up CI/CD pipelines.",
    "How do you approach infrastructure automation?",
    "What monitoring and logging practices do you implement?",
    "How do you ensure security in your DevOps processes?",
    "How do you handle incident response in a production environment?"
  ],
  "ML Engineer": [
    "Explain your experience with deploying machine learning models to production.",
    "How do you ensure the quality and reliability of machine learning systems?",
    "Describe your approach to feature engineering and selection.",
    "How do you handle the challenges of training models on large datasets?",
    "How do you keep up with the rapidly evolving field of machine learning?"
  ],
  "Full Stack Developer": [
    "How do you manage the frontend and backend parts of an application?",
    "What's your approach to ensuring data consistency across the stack?",
    "Tell me about a full stack project you've worked on from inception to deployment.",
    "How do you handle authentication and authorization in a full stack app?",
    "What strategies do you use for state management across the entire application?"
  ],
  "Cloud Architect": [
    "How do you approach designing multi-region, highly available cloud architectures?",
    "Describe your experience with cloud cost optimization.",
    "How do you implement security in cloud environments?",
    "Explain how you manage cloud infrastructure at scale.",
    "How do you approach migrating legacy applications to the cloud?"
  ],
  "Default": [
    "Tell me about your background and experience.",
    "What are your strengths and weaknesses?",
    "How do you stay updated with the latest technologies?",
    "How do you approach problem-solving?",
    "Where do you see yourself in 5 years?"
  ]
};

enum InterviewStage {
  AgentSelection = "agent-selection",
  Setup = "setup",
  Questions = "questions",
  Recording = "recording",
  Complete = "complete",
}

const MockInterview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<InterviewStage>(InterviewStage.AgentSelection);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCourseTabActive, setCourseTabActive] = useState(false);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [interviewId, setInterviewId] = useState<string>("mock-001");
  
  // Agentic AI Mock Data
  const emotionalData = {
    confidence: 78,
    engagement: 85,
    stress: 32,
    clarity: 72,
    overall_score: 77,
    recommendations: [
      "Maintain eye contact with the camera for better connection",
      "Slow down slightly - you're speaking a bit fast",
      "Use more specific examples in your answers",
      "Great body language! Keep it up"
    ]
  };

  const questionAnalytics = {
    difficulty_adaptation: 65,
    performance_trend: 'improving' as const,
    suggested_topics: ['System Design', 'Problem Solving', 'Communication'],
    next_question_preview: "Tell me about a time when you had to work with a difficult team member...",
    ai_confidence: 92
  };

  const agentActivities = [
    {
      id: "interview-coach",
      name: "Interview Coach AI",
      status: "active" as const,
      lastActivity: "Analyzing facial expressions and speech patterns",
      progress: 78,
      recommendations: ["Focus on maintaining steady eye contact", "Practice the STAR method for behavioral questions"]
    },
    {
      id: "emotion-analyzer",
      name: "Emotional Intelligence Analyzer",
      status: "active" as const,
      lastActivity: "Real-time confidence and stress level monitoring",
      progress: 85,
      recommendations: ["Great improvement in confidence over last 3 questions", "Consider deep breathing between answers"]
    },
    {
      id: "adaptive-engine",
      name: "Adaptive Question Engine",
      status: "processing" as const,
      lastActivity: "Adjusting question difficulty based on performance",
      progress: 92,
      recommendations: ["Next question will focus on technical depth", "Performance trend: Improving"]
    },
    {
      id: "speech-analyzer",
      name: "Speech Pattern Analyzer",
      status: "active" as const,
      lastActivity: "Monitoring pace, clarity, and filler words",
      progress: 67,
      recommendations: ["Reduce 'um' and 'uh' usage", "Excellent technical vocabulary"]
    }
  ];

  const progressData = {
    skillsGrowth: [
      { skill: "Communication", current: 78, target: 90, improvement: 12 },
      { skill: "Technical Knowledge", current: 85, target: 95, improvement: 8 },
      { skill: "Problem Solving", current: 72, target: 85, improvement: 15 },
      { skill: "Confidence", current: 80, target: 90, improvement: 18 }
    ],
    weeklyProgress: [
      { week: "Week 1", interviews: 3, avgScore: 65 },
      { week: "Week 2", interviews: 5, avgScore: 72 },
      { week: "Week 3", interviews: 4, avgScore: 78 },
      { week: "Week 4", interviews: 6, avgScore: 83 }
    ],
    achievements: [
      { title: "First Perfect Answer", description: "Scored 100% on communication", date: "2 days ago", type: "milestone" as const },
      { title: "Stress Management", description: "Maintained low stress levels", date: "1 week ago", type: "improvement" as const },
      { title: "Technical Excellence", description: "Perfect technical accuracy", date: "3 days ago", type: "milestone" as const }
    ]
  };

  // Static mock interviews data
  const recentInterviews = [
    { id: "mock-001", job_role: "Frontend Developer", tech_stack: "React, TypeScript", experience: "3-5", created_at: new Date().toISOString(), user_id: "mock-user", completed: true },
    { id: "mock-002", job_role: "Full Stack Engineer", tech_stack: "Node.js, Express, MongoDB", experience: "1-3", created_at: new Date().toISOString(), user_id: "mock-user", completed: false },
    { id: "mock-003", job_role: "Data Scientist", tech_stack: "Python, TensorFlow, PyTorch", experience: "5+", created_at: new Date().toISOString(), user_id: "mock-user", completed: true },
  ];

  // Static mock courses data
  const recentCourses = [
    {
      title: "React Fundamentals",
      purpose: "job_interview",
      difficulty: "intermediate",
      date: "15 minutes ago",
      status: "Generated",
      progress: 100,
      id: "mock1"
    },
    {
      title: "Data Structures and Algorithms",
      purpose: "exam",
      difficulty: "advanced",
      date: "2 hours ago",
      status: "Generated",
      progress: 100,
      id: "mock2"
    },
    {
      title: "Machine Learning Basics",
      purpose: "practice",
      difficulty: "beginner",
      date: "Yesterday",
      status: "Generated",
      progress: 100,
      id: "mock3"
    }
  ];

  const handleAgentSelection = (agentId: string) => {
    setSelectedAgent(agentId);
    toast({
      title: "Agent Selected",
      description: "Your AI agent has been configured for the interview.",
    });
    setStage(InterviewStage.Setup);
  };

  const handleInterviewSetup = (role: string, techStack: string, experience: string) => {
    setIsLoading(true);
    
    // Generate a mock interview ID
    const mockId = `mock-${Date.now()}`;
    setInterviewId(mockId);
    
    // Get questions based on role
    const jobType = role.includes("Frontend") ? "Frontend Developer" :
                    role.includes("Backend") ? "Backend Developer" :
                    role.includes("Full") ? "Full Stack Developer" :
                    role.includes("Data") ? "Data Scientist" :
                    role.includes("DevOps") ? "DevOps Engineer" :
                    role.includes("ML") ? "ML Engineer" :
                    role.includes("Cloud") ? "Cloud Architect" : "Default";
    
    const interviewQuestions = staticQuestions[jobType as keyof typeof staticQuestions] || staticQuestions["Default"];
    
    // Set up the questions
    setQuestions(interviewQuestions);
    setCurrentQuestionIndex(0);
    
    // Update UI
    toast({
      title: "Interview Created",
      description: "Your mock interview has been set up successfully.",
    });
    
    setIsLoading(false);
    setStage(InterviewStage.Questions);
  };

  const handleAnswerSubmitted = () => {
    setRecordingComplete(true);
    toast({
      title: "Answer Recorded",
      description: "Your answer has been recorded successfully.",
    });
  };

  const handleNextQuestion = () => {
    setRecordingComplete(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStage(InterviewStage.Questions);
    } else {
      // Interview is complete, navigate directly to results
      navigate(`/interview-result/mock-001`);
    }
  };

  const handleSubmitCourse = (courseName: string, purpose: string, difficulty: string) => {
    setIsGeneratingCourse(true);
    
    // Simulate course generation
    setTimeout(() => {
      toast({
        title: "Course Generation Complete",
        description: "Your course has been generated successfully.",
      });
      
      setIsGeneratingCourse(false);
      navigate(`/course/mock1`);
    }, 2000);
  };

  const startRecording = () => {
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    handleAnswerSubmitted(); // Auto-submit when recording stops
  };
  
  const handleCancel = () => {
    setStage(InterviewStage.Questions);
  };

  const handleDownloadInterview = () => {
    toast({
      title: "Interview Downloaded",
      description: "Your interview has been downloaded successfully.",
    });
  };

  const resumeInterview = (interview: any) => {
    // Set up with static interview questions
    const jobType = interview.job_role.includes("Frontend") ? "Frontend Developer" :
                    interview.job_role.includes("Backend") ? "Backend Developer" :
                    interview.job_role.includes("Full") ? "Full Stack Developer" :
                    interview.job_role.includes("Data") ? "Data Scientist" :
                    interview.job_role.includes("DevOps") ? "DevOps Engineer" :
                    interview.job_role.includes("ML") ? "ML Engineer" :
                    interview.job_role.includes("Cloud") ? "Cloud Architect" : "Default";
    
    const interviewQuestions = staticQuestions[jobType as keyof typeof staticQuestions] || staticQuestions["Default"];
    
    setQuestions(interviewQuestions);
    setCurrentQuestionIndex(0);
    setInterviewId(interview.id);
    setStage(InterviewStage.Questions);
  };

  const renderStage = () => {
    switch (stage) {
      case InterviewStage.AgentSelection:
        return (
          <div className="space-y-8">
            <AgentSelectionPanel 
              onAgentSelect={handleAgentSelection}
              selectedAgent={selectedAgent}
            />
          </div>
        );
      
      case InterviewStage.Setup:
        return (
          <div className="space-y-8">
            <div className="mb-6 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStage(InterviewStage.AgentSelection)}
                className="text-muted-foreground"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Choose Different Agent
              </Button>
              {selectedAgent && (
                <div className="text-sm text-muted-foreground">
                  Using: <span className="font-medium text-foreground">{selectedAgent}</span>
                </div>
              )}
            </div>
            <InterviewSetup onSubmit={handleInterviewSetup} isLoading={isLoading} />
            {renderRecentInterviews()}
          </div>
        );
      
      case InterviewStage.Questions:
        if (questions.length === 0) {
          return (
            <div className="text-center py-12">
              <p>No questions available. Please set up a new interview.</p>
            </div>
          );
        }
        
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Question Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-6 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStage(InterviewStage.Setup)}
                  className="text-muted-foreground"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Cancel Interview
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>
                    AI is analyzing your performance and adapting the difficulty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-md text-lg">
                    {questions[currentQuestionIndex]}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center mt-4">
                <Button 
                  size="lg"
                  onClick={() => setStage(InterviewStage.Recording)}
                >
                  Ready to Answer
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Camera Preview</CardTitle>
                  <CardDescription>
                    AI-powered analysis will start when you begin recording
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoRecorder 
                    onRecordingComplete={() => {}}
                    isRecording={false}
                    startRecording={() => {}}
                    stopRecording={() => {}}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* AI Analytics Sidebar */}
            <div className="space-y-4">
              <EmotionalAnalysisPanel 
                data={emotionalData} 
                isAnalyzing={false}
              />
              
              <AdaptiveQuestionEngine
                analytics={questionAnalytics}
                currentDifficulty="medium"
                questionsAnswered={currentQuestionIndex}
                totalQuestions={questions.length}
              />
            </div>
          </div>
        );
      
      case InterviewStage.Recording:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recording Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Question {currentQuestionIndex + 1}: Live AI Analysis
                </h2>
                <div className="p-4 bg-muted rounded-md text-lg mb-4">
                  {questions[currentQuestionIndex]}
                </div>
                <p className="text-muted-foreground">
                  AI is analyzing your facial expressions, speech patterns, and confidence level in real-time.
                </p>
              </div>
              
              <VideoRecorder 
                onRecordingComplete={handleAnswerSubmitted}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
              />
              
              <div className="mt-6 flex justify-center space-x-4">
                {recordingComplete ? (
                  <Button 
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-primary text-white rounded-lg flex items-center space-x-2"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {/* Agent Activity Panel for Recording Stage */}
              <AgentActivityPanel userId="mock-user" currentCourseId="interview-session" />
            </div>
            
            {/* Live AI Analysis Sidebar */}
            <div className="space-y-4">
              <EmotionalAnalysisPanel 
                data={emotionalData} 
                isAnalyzing={isRecording}
              />
              
              <ProgressAnalytics 
                userId="mock-user" 
                courseId="interview-session"
                metrics={{
                  overallScore: progressData.skillsGrowth.reduce((acc, skill) => acc + skill.current, 0) / progressData.skillsGrowth.length,
                  weeklyProgress: 15,
                  completedActivities: currentQuestionIndex + 1,
                  totalActivities: questions.length,
                  learningStreak: 7,
                  timeSpent: 45,
                  strengths: progressData.skillsGrowth.filter(s => s.current >= 80).map(s => s.skill),
                  weaknesses: progressData.skillsGrowth.filter(s => s.current < 75).map(s => s.skill),
                  recommendations: emotionalData.recommendations
                }}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderRecentInterviews = () => {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recent Mock Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentInterviews.map((interview) => (
            <Card key={interview.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{interview.job_role}</CardTitle>
                    <CardDescription>{new Date(interview.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    interview.completed ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {interview.completed ? "Completed" : "In Progress"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {interview.tech_stack.split(',').map((tech, i) => (
                    <div key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-secondary">
                      {tech.trim()}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      if (interview.completed) {
                        navigate(`/interview-result/${interview.id}`);
                      } else {
                        resumeInterview(interview);
                      }
                    }}
                  >
                    {interview.completed ? "View Results" : "Resume Interview"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                AI-Powered Mock Interview
              </h1>
              <p className="text-muted-foreground">
                Practice with advanced AI agents and get instant feedback
              </p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-card rounded-lg border shadow-sm">
              <Button
                variant={!isCourseTabActive ? "default" : "ghost"}
                onClick={() => setCourseTabActive(false)}
                className="rounded-r-none"
              >
                Mock Interview
              </Button>
              <Button
                variant={isCourseTabActive ? "default" : "ghost"}
                onClick={() => setCourseTabActive(true)}
                className="rounded-l-none"
              >
                Generate Course
              </Button>
            </div>
          </div>

          {isCourseTabActive ? (
            <div className="space-y-8">
              <CourseForm onSubmit={handleSubmitCourse} isLoading={isGeneratingCourse} />
              
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Recent Course Generations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentCourses.map((course, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>{course.date}</CardDescription>
                          </div>
                          <div className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                            {course.purpose.replace('_', ' ')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{course.difficulty}</span>
                          <span className="text-sm text-muted-foreground">{course.status}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate(`/course/${course.id}`)}
                          >
                            View Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            renderStage()
          )}
        </div>
      </Container>
    </div>
  );
};

export default MockInterview;
