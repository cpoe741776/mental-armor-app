// src/repairMappings.js
export const repairMappings = {
  emotion: {
    Anxious: ['mindfulness','reframe','spiritual_resilience','whats_most_important','values_based_living'],
    Overwhelmed: ['reframe','mindfulness','whats_most_important','values_based_living'],
    Sad: ['gratitude','spiritual_resilience','good_listening_celebrate_news'],
    Angry: ['reframe','balance_your_thinking','interpersonal_problem_solving'],
    Frustrated: ['balance_your_thinking','reframe','mindfulness'],
    Lonely: ['good_listening_celebrate_news','social_support'],
    Insecure: ['values_based_living','flex'],
    Stressed: ['mindfulness','spiritual_resilience','balance_your_thinking']
  },
  event: {
    'Problem with a person(s)': ['interpersonal_problem_solving','good_listening_celebrate_news'],
    'Loss of a relationship': ['spiritual_resilience','gratitude','good_listening_celebrate_news'],
    'Heavy Workload': ['balance_your_thinking','mindfulness','science_of_resilience'],
    'Life Dissatisfaction': ['values_based_living','flex','spiritual_resilience'],
    'Unexpected Change': ['science_of_resilience','mindfulness','reframe']
  }
};
