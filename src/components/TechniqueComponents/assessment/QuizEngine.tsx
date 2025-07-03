import React, { useState } from 'react';
import { Question, Assessment } from '../../../types/technique';
import styles from './QuizEngine.module.css';

interface QuizEngineProps {
  assessment: Assessment;
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizEngine({ assessment, onComplete }: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  const handleAnswer = (answer: string | string[]) => {
    const isCorrect = checkAnswer(currentQuestion, answer);
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });

    if (isCorrect) {
      setScore(score + currentQuestion.points);
    }

    setShowFeedback(true);
  };

  const checkAnswer = (question: Question, answer: string | string[]): boolean => {
    if (question.type === 'ordering') {
      return JSON.stringify(answer) === JSON.stringify(question.correctAnswer);
    }
    return answer === question.correctAnswer;
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= assessment.passingScore;
    
    setIsCompleted(true);
    onComplete(percentage, passed);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'visual-recognition':
        return renderVisualRecognition();
      case 'ordering':
        return renderOrdering();
      default:
        return null;
    }
  };

  const renderMultipleChoice = () => {
    const selected = selectedAnswers[currentQuestion.id] as string;
    
    return (
      <div className={styles.options}>
        {currentQuestion.options?.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={option}
              className={`${styles.optionButton} ${
                isSelected ? styles.selected : ''
              } ${showCorrect ? styles.correct : ''} ${
                showIncorrect ? styles.incorrect : ''
              }`}
              onClick={() => !showFeedback && handleAnswer(option)}
              disabled={showFeedback}
            >
              {option}
              {showCorrect && <span className={styles.checkmark}>✓</span>}
              {showIncorrect && <span className={styles.cross}>✗</span>}
            </button>
          );
        })}
      </div>
    );
  };

  const renderVisualRecognition = () => {
    // Similar to multiple choice but with images
    return renderMultipleChoice();
  };

  const renderOrdering = () => {
    const [items, setItems] = useState(currentQuestion.options || []);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (item: string) => {
      setDraggedItem(item);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (!draggedItem) return;

      const draggedIndex = items.indexOf(draggedItem);
      const newItems = [...items];
      newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      
      setItems(newItems);
      setDraggedItem(null);
    };

    return (
      <div className={styles.orderingContainer}>
        <p className={styles.hint}>Drag items to put them in the correct order</p>
        <div className={styles.orderingList}>
          {items.map((item, index) => (
            <div
              key={item}
              className={styles.orderingItem}
              draggable={!showFeedback}
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <span className={styles.orderNumber}>{index + 1}</span>
              {item}
            </div>
          ))}
        </div>
        {!showFeedback && (
          <button
            className={styles.submitButton}
            onClick={() => handleAnswer(items)}
          >
            Submit Order
          </button>
        )}
      </div>
    );
  };

  if (isCompleted) {
    const totalPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= assessment.passingScore;

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h2>Quiz Complete!</h2>
          <div className={`${styles.scoreCircle} ${passed ? styles.passed : styles.failed}`}>
            <span className={styles.scoreValue}>{Math.round(percentage)}%</span>
          </div>
        </div>
        
        <p className={styles.resultMessage}>
          {passed
            ? '🎉 Congratulations! You passed the assessment.'
            : `📚 You need ${assessment.passingScore}% to pass. ${
                assessment.retryAllowed ? 'You can try again!' : ''
              }`}
        </p>

        <div className={styles.resultStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Score</span>
            <span className={styles.statValue}>
              {score} / {totalPoints} points
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Questions</span>
            <span className={styles.statValue}>
              {assessment.questions.length} answered
            </span>
          </div>
        </div>

        {assessment.retryAllowed && !passed && (
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.header}>
        <h3>Technique Check</h3>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {assessment.questions.length}
        </span>
      </div>

      <div className={styles.questionSection}>
        <h4 className={styles.questionText}>{currentQuestion.question}</h4>
        {renderQuestion()}
      </div>

      {showFeedback && (
        <div
          className={`${styles.feedback} ${
            checkAnswer(currentQuestion, selectedAnswers[currentQuestion.id])
              ? styles.correctFeedback
              : styles.incorrectFeedback
          }`}
        >
          <p className={styles.feedbackText}>{currentQuestion.explanation}</p>
          <button className={styles.nextButton} onClick={handleNext}>
            {currentQuestionIndex < assessment.questions.length - 1
              ? 'Next Question'
              : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}