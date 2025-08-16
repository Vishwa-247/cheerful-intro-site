import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Bot, User, Send, Lightbulb, TrendingUp } from "lucide-react";

interface ChatMentorProps {
  userId: string;
  currentTopic?: string;
  userProgress?: {
    strengths: string[];
    weaknesses: string[];
    recentScore: number;
  };
}

const ChatMentor: React.FC<ChatMentorProps> = ({ 
  userId, 
  currentTopic = "Advanced React Patterns",
  userProgress = {
    strengths: ["Component Architecture", "State Management"],
    weaknesses: ["Performance Optimization", "Testing Patterns"],
    recentScore: 0.72
  }
}) => {
  const [messages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: `👋 Hey! I'm your AI Learning Mentor analyzing "${currentTopic}". You're doing great with ${userProgress.strengths.join(' and ')}, but let's work on ${userProgress.weaknesses.join(' and ')}. What would you like to explore?`,
      type: 'insight' as const
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          AI Learning Mentor
        </CardTitle>
        <CardDescription>
          Contextual tutoring powered by your learning progress
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Score: {Math.round(userProgress.recentScore * 100)}%
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Topic: {currentTopic}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Bot className="h-4 w-4 mt-1 text-primary" />
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      AI Insight
                    </Badge>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about your learning..."
              className="flex-1"
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatMentor;