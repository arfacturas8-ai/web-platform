import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
  LinearProgress,
  Paper,
  Checkbox,
  Alert,
} from '@mui/material';
import StarRating from './StarRating';

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: 'text' | 'rating' | 'multiple_choice' | 'yes_no' | 'scale';
  options?: string[];
  is_required: boolean;
}

interface SurveyFormProps {
  survey: {
    id: string;
    name: string;
    description?: string;
    questions: SurveyQuestion[];
  };
  onSubmit: (responses: Record<string, any>) => void;
  onCancel?: () => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ survey, onSubmit, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const validateCurrentQuestion = (): boolean => {
    if (currentQuestion.is_required && !responses[currentQuestion.id]) {
      setErrors({ [currentQuestion.id]: 'This question is required' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;

    if (isLastQuestion) {
      onSubmit(responses);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const renderQuestionInput = (question: SurveyQuestion) => {
    switch (question.question_type) {
      case 'text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your answer here..."
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            error={!!errors[question.id]}
            helperText={errors[question.id]}
          />
        );

      case 'rating':
        return (
          <Box>
            <StarRating
              value={responses[question.id] || 0}
              onChange={(value) => handleResponseChange(question.id, value)}
              size="large"
              showLabel
            />
            {errors[question.id] && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors[question.id]}
              </Typography>
            )}
          </Box>
        );

      case 'scale':
        return (
          <FormControl error={!!errors[question.id]} fullWidth>
            <RadioGroup
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
              row
              sx={{ justifyContent: 'space-between' }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <FormControlLabel
                  key={num}
                  value={num}
                  control={<Radio />}
                  label={num.toString()}
                  labelPlacement="top"
                />
              ))}
            </RadioGroup>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption">Not Likely</Typography>
              <Typography variant="caption">Very Likely</Typography>
            </Box>
            {errors[question.id] && (
              <Typography color="error" variant="caption">
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );

      case 'multiple_choice':
        return (
          <FormControl error={!!errors[question.id]} fullWidth>
            <RadioGroup
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {errors[question.id] && (
              <Typography color="error" variant="caption">
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );

      case 'yes_no':
        return (
          <FormControl error={!!errors[question.id]} fullWidth>
            <RadioGroup
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              row
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            {errors[question.id] && (
              <Typography color="error" variant="caption">
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {survey.name}
        </Typography>
        {survey.description && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {survey.description}
          </Typography>
        )}

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />

        <Typography variant="caption" color="text.secondary" gutterBottom>
          Question {currentQuestionIndex + 1} of {survey.questions.length}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            {currentQuestion.question_text}
            {currentQuestion.is_required && (
              <Typography component="span" color="error">
                {' '}
                *
              </Typography>
            )}
          </Typography>

          <Box sx={{ mt: 3 }}>{renderQuestionInput(currentQuestion)}</Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            onClick={currentQuestionIndex === 0 ? onCancel : handlePrevious}
            disabled={currentQuestionIndex === 0 && !onCancel}
          >
            {currentQuestionIndex === 0 ? 'Cancel' : 'Previous'}
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {isLastQuestion ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SurveyForm;
