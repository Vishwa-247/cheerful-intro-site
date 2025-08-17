import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Zap, Target, AlertTriangle, Smile } from 'lucide-react';

interface EmotionalData {
  confidence: number;
  engagement: number;
  stress: number;
  clarity: number;
  overall_score: number;
  recommendations: string[];
}

interface EmotionalAnalysisPanelProps {
  data: EmotionalData;
  isAnalyzing: boolean;
}

const EmotionalAnalysisPanel: React.FC<EmotionalAnalysisPanelProps> = ({ data, isAnalyzing }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Smile className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Target className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const metrics = [
    { label: 'Confidence', value: data.confidence, icon: <Brain className="h-4 w-4" /> },
    { label: 'Engagement', value: data.engagement, icon: <Heart className="h-4 w-4" /> },
    { label: 'Stress Level', value: data.stress, icon: <Zap className="h-4 w-4" />, inverse: true },
    { label: 'Clarity', value: data.clarity, icon: <Target className="h-4 w-4" /> }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Emotional Intelligence Analysis
          {isAnalyzing && (
            <Badge variant="secondary" className="ml-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
              Live Analysis
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getScoreIcon(data.overall_score)}
            <span className="text-sm text-muted-foreground">Overall Performance</span>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(data.overall_score)}`}>
            {data.overall_score}%
          </div>
          <Progress value={data.overall_score} className="mt-2" />
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className={`text-sm font-semibold ${getScoreColor(metric.inverse ? 100 - metric.value : metric.value)}`}>
                  {metric.value}%
                </span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        {/* Real-time Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Live Recommendations</h4>
          <div className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
                <Target className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-blue-800">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalAnalysisPanel;