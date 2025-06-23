// src/skills.js

export const skills = [
  {
    id: 'science_of_resilience',
    title: 'The Science of Resilience',
    category: 'Foundation',
    brief: 'Understand core resilience principles and mindset.',
    trainer: 'Rhonda',
    trainerImage: '/rhonda.jpg',
    goal:
      'Provide a psychological foundation of what resilience is and how individuals define it through personal characteristics.',
    when:
      'At the start of the program or when needing a refresher on resilience principles.',
    benefits: [
      'Shared language for resilience',
      'Clarified resilience components',
      'Growth mindset introduction'
    ],
    definitions: [
      { term: 'Resilience', definition: 'Ability to withstand, recover, and grow in the face of stressors.' },
      { term: 'Growth Mindset', definition: 'Belief that abilities can develop through effort and learning.' }
    ],
    // Single string for the “Definition” tab (combined or first definition)
    definition:
      'Resilience is the ability to withstand, recover, and grow in the face of stressors. A growth mindset is the belief that abilities can develop through effort and learning.',
    examples: [
      'After a setback at work, list two lessons learned instead of focusing on failure.',
      'When faced with a challenging project, remind yourself you can improve through practice.'
    ],
    // Map each step’s description into “details” for SkillDetail
    details: [
      'Watch Introduction: View Dr. Cornum’s resilience story.',
      'Define Resilience: Write your own definition based on the video.',
      'Action Planning: Choose one resilience trait to strengthen.'
    ],
      link: '/skills/science_of_resilience', // ✅ string, not array
      recommendedBy: 'Brigadier General Rhonda Cornum',             // ✅ in the same object, not wrapped in []
  },

 {
  id: 'flex',
  title: 'Flex Your Strengths',
  domains: ['family', 'emotional'],
  category: 'Values & Meaning',
  brief: 'Identify and apply your character strengths in new contexts.',
  trainer: 'AJ',
  trainerImage: '/aj.jpg',
  videoUrl: 'https://videos.files.wordpress.com/HXvYn4pz/fys.mp4',
  videoThumbnail: 'https://via.placeholder.com/800x450.png?text=Flex+Your+Strengths+Video',
  goal: 'Identify and apply your strengths at work and home.',
  when: 'When you want to leverage your unique talents.',
  benefits: [
    'Increased confidence',
    'Better performance',
    'Enhanced well-being'
  ],
  definitions: [
    { term: 'Signature Strengths', definition: 'Your most prominent personal traits.' },
    { term: 'Application', definition: 'Using a strength in a new context for impact.' }
  ],
  definition:
    'Signature strengths are your most prominent personal traits. Application means using a strength in a new context for greater impact.',
  examples: [
    'If “Creativity” is a signature strength, brainstorm a new hobby that uses creative thinking.',
    'Notice when a colleague demonstrates “Curiosity,” and ask them about their process.'
  ],
  details: [
    'Identify Strengths: List your top 3 signature strengths from the MFA.',
    'Notice in Others: Reflect on strengths shown by those around you.',
    'Apply in New Ways: Plan a novel activity using one strength.',
    'Reflect on Impact: Journal about outcomes and feelings.'
  ],
  link: '/skills/flex',           // ✅ string, not array
  recommendedBy: 'AJ'             // ✅ in the same object, not wrapped in []
},

  {
    id: 'spiritual_resilience',
    title: 'Spiritual Resilience',
    category: 'Values & Meaning',
    domains: ['spiritual', 'family'] ,
    brief: 'Use beliefs for hope and well-being.',
    trainer: 'Chris',
    trainerImage: '/chris.jpg',
    goal: 'Identify beliefs that sustain purpose and hope.',
    when: 'When seeking renewal.',
    benefits: [
      'Increased hope',
      'Enhanced life satisfaction',
      'Greater connection'
    ],
    definitions: [
      { term: 'Spirituality', definition: 'Belief in something larger than oneself.' },
      { term: 'Purpose', definition: 'Sense of meaning guiding actions.' }
    ],
    definition:
      'Spirituality is belief in something larger than oneself. Purpose is the sense of meaning that guides actions.',
    examples: [
      'Write down three core beliefs that give your life meaning and read them each morning.',
      'Attend a service or gathering that reinforces your spiritual values once this week.'
    ],
    details: [
      'Reflect on Beliefs: Write down your core beliefs or principles.',
      'Connect to Purpose: Describe how beliefs give life meaning.',
      'Identify Practices: List activities that reinforce beliefs.',
      'Plan Renewal: Schedule one spiritual practice this week.'
    ],
  link: '/skills/spiritual_resilience',
  recommendedBy: 'Chris'
},

  {
    id: 'gratitude',
    title: 'Gratitude',
    category: 'Values & Meaning',
    domains: ['emotional' , 'family'] ,
    brief: 'Cultivate positive emotions by reflecting.',
    trainer: 'Scotty',
    trainerImage: '/scotty.jpg',
    goal: 'Pay attention to good things deliberately.',
    when: 'On a regular basis or when facing challenges.',
    benefits: [
      'Improved sleep',
      'Stronger relationships',
      'Reduced anxiety'
    ],
    definitions: [
      { term: 'Gratitude', definition: 'Thankfulness and appreciation.' },
      { term: 'Upward Spiral', definition: 'Cycle where positivity builds.' }
    ],
    definition:
      'Gratitude is thankfulness and appreciation. Upward spiral refers to the cycle where positivity builds and reinforces itself.',
    examples: [
      'Each night, write three things you were grateful for and why.',
      'Express thanks directly to someone who helped you during the day.'
    ],
    details: [
      'Recall Positive Event: Think of one good thing from the last 24 hours.',
      'Reflection: Answer why it went well, who contributed, and its impact.',
      'Record in Journal: Log the event and reflections.',
      'Review Entries: Revisit entries weekly to reinforce positivity.'
    ],
  link: '/skills/gratitude',
  recommendedBy: 'Scotty'
},

  {
    id: 'mindfulness',
    title: 'Mindfulness',
    category: 'Resilient Thinking',
    domains: ['emotional' , 'spiritual'] ,
    brief: 'Practice present-moment awareness.',
    trainer: 'AJ',
    trainerImage: '/aj.jpg',
    goal: 'Reduce stress and remain focused.',
    when: 'When you feel overwhelmed or disconnected.',
    benefits: [
      'Greater confidence',
      'Improved well-being',
      'Enhanced attention'
    ],
    definitions: [
      { term: 'Mindfulness', definition: 'Purposeful, present-moment attention.' },
      { term: 'Grounding Technique', definition: 'Methods to bring attention back to the present.' }
    ],
    definition:
      'Mindfulness is purposeful, present-moment attention. Grounding techniques help bring attention back to the present.',
    examples: [
      'Spend 2 minutes focusing solely on the sensation of your breath.',
      'During a break, notice and name three things you see, hear, and feel.'
    ],
    details: [
      'Informal Practice: Engage fully in a simple activity for 1–2 minutes.',
      'Formal Practice: Meditate for 5 minutes, focusing on your breath.',
      'In-the-Moment Technique: Do 3 deep breaths and identify five senses.',
      'Reflect & Plan: Note a mindful moment and schedule your next practice.'
    ],
  link: '/skills/mindfulness',
  recommendedBy: 'AJ'
},

  {
    id: 'reframe',
    title: 'ReFrame',
    category: 'Resilient Thinking',
    domains: ['emotional'] ,
    brief: 'Recognize and shift unhelpful thoughts.',
    trainer: 'Chris',
    trainerImage: '/chris.jpg',
    goal: 'Learn to recognize and reframe unhelpful thoughts.',
    when: 'When you notice stress or unhelpful reactions.',
    benefits: [
      'Emotional regulation',
      'Positive outlook',
      'Effective problem-solving'
    ],
    definitions: [
      { term: 'Event', definition: 'An occurrence that triggers reactions.' },
      { term: 'Reframe', definition: 'Shifting perspective to a balanced view.' }
    ],
    definition:
      'An event is an occurrence that triggers reactions. To reframe means shifting perspective to a balanced, constructive viewpoint.',
    examples: [
      'If you think “I always fail,” reframe to “I have faced challenges before and learned from them.”',
      'When a task seems impossible, reframe “I can’t do this” to “I can try by breaking it into smaller steps.”'
    ],
    details: [
      'Describe the Event: State the situation objectively without judgment.',
      'Identify Reactions: Note automatic thoughts, emotions, and behaviors.',
      'Generate Reframe: Create a realistic, constructive alternate thought.',
      'Practice & Reflect: Apply the reframe and observe outcomes.'
    ],
  link: '/skills/reframe',
  recommendedBy: 'Chris'
},

  {
    id: 'balance_your_thinking',
    title: 'Balance Your Thinking',
    category: 'Resilient Thinking',
    domains: ['emotional'] ,
    brief: 'Evaluate thoughts against evidence to make balanced decisions.',
    trainer: 'Terry',
    trainerImage: '/terry.jpg',
    videoUrl: 'https://videos.files.wordpress.com/R6fW11cK/bytintro.mp4',
    videoThumbnail: 'https://via.placeholder.com/800x450.png?text=BYT+Video',
    goal:
      'Help you see situations accurately and take action based on evidence.',
    when: 'When you recognize biased or rushed thinking.',
    benefits: [
      'Improved decisions',
      'Reduced distortion',
      'Aligned actions'
    ],
    definitions: [
      { term: 'All-or-Nothing', definition: 'Seeing things in black-and-white terms.' },
      { term: 'Confirmation Bias', definition: 'Focusing only on evidence that supports beliefs.' }
    ],
    definition:
      'All-or-nothing thinking means seeing things in black-and-white terms. Confirmation bias is focusing only on evidence that supports your beliefs.',
    examples: [
      'If you assume “Everyone is against me,” gather facts by asking colleagues for feedback.',
      'When you think “I can’t succeed,” write down evidence of past successes to counter that belief.'
    ],
    details: [
      'Select an Event: Choose a recent situation with an unhelpful thought.',
      'Identify Thought: Write down the specific unbalanced thought.',
      'Examine Evidence: List facts for and against that thought.',
      'Formulate Reframe: Create a balanced, evidence-based thought.'
    ],
  link: '/skills/balance_your_thinking',
  recommendedBy: 'Terry'
},

  {
    id: 'whats_most_important',
    title: "What's Most Important",
    category: 'Resilient Thinking',
    domains: ['emotional'] ,
    brief: 'Pause to assess thought patterns and choose value-aligned responses.',
    trainer: 'Chris',
    trainerImage: '/chris.jpg',
    goal:
      'Pause and evaluate recurring thought patterns, then make a new plan aligned with priorities.',
    when:
      'When reactions interfere with your values, goals, or relationships.',
    benefits: [
      'Deliberate decision-making',
      'Reduced impulsivity',
      'Greater alignment with priorities'
    ],
    definitions: [
      { term: 'Pause & Observe', definition: 'Stopping to notice sensations and thoughts.' },
      { term: 'New Plan', definition: 'A chosen action aligned with priorities.' }
    ],
    definition:
      'Pause & Observe means stopping to notice sensations and thoughts. A New Plan is a chosen action aligned with your priorities.',
    examples: [
      'When feeling reactive, pause before responding and ask “What matters most right now?”',
      'If you’re tempted to lash out in anger, pause and choose a response that aligns with your value of respect.'
    ],
    details: [
      'Describe the Event: State the situation objectively.',
      'Identify Influences: Spot “shoulds” or internal voices driving reactions.',
      "Ask What’s Important: Use your top priority to reframe thoughts.",
      'Implement & Reflect: Apply your new plan and note outcomes.'
    ],
  link: '/skills/whats_most_important',
  recommendedBy: 'Chris'
},

  {
    id: 'interpersonal_problem_solving',
    title: 'Interpersonal Problem Solving',
    category: 'Social Resilience' ,
    domains: ['social' , 'family'] ,
    brief: 'Resolve conflicts respectfully through collaborative solutions.',
    trainer: 'Terry',
    trainerImage: '/terry.jpg',
    goal:
      'Address interpersonal problems in a way that respects relationships and reduces tension.',
    when:
      'When facing disagreements that require mutual understanding and collaboration.',
    benefits: [
      'Stronger relationships',
      'Effective conflict resolution',
      'Mutual understanding'
    ],
    definitions: [
      {
        term: 'Constructive Conflict',
        definition: 'Conflict that strengthens relationships through respectful dialogue.'
      },
      { term: 'Active Listening', definition: 'Fully concentrating and responding to the speaker.' }
    ],
    definition:
      'Constructive Conflict is conflict that strengthens relationships through respectful dialogue. Active Listening is fully concentrating on and responding to the speaker.',
    examples: [
      'When tensions rise in a team meeting, use “I” statements and ask open-ended questions instead of assigning blame.',
      'If a friend is upset, paraphrase their concerns before offering your perspective.'
    ],
    details: [
      'Do Your Homework: Prepare by defining the problem and balancing thoughts.',
      'Wind-Up: Open with a neutral statement using “I” language.',
      'Ask for Perspective: Listen actively and paraphrase to confirm understanding.',
      'Brainstorm Solutions: Generate options collaboratively.',
      'Agree & Follow-Up: Choose a solution and set next steps.'
    ],
  link: '/skills/interpersonal_problem_solving',
  recommendedBy: 'Terry'
},

  {
    id: 'good_listening_celebrate_news',
    title: 'Good Listening & Celebrate Good News',
    category: 'Social Resilience',
    domains: ['social' , 'family'] ,
    brief: 'Deepen connections by active listening and sharing positive events.',
    trainer: 'Scotty',
    trainerImage: '/scotty.jpg',
    goal:
      'Build, strengthen, and maintain relationships through active listening and celebrating successes.',
    when: 'When engaging in conversations or celebrating good news.',
    benefits: [
      'Enhanced empathy',
      'Stronger support networks',
      'Amplified positivity'
    ],
    definitions: [
      { term: 'Attend with Genuine Interest', definition: 'Focus fully on the speaker without distraction.' },
      { term: 'Savoring', definition: 'Prompt vivid recall to deepen positive emotions.' }
    ],
    definition:
      'Attend with Genuine Interest means focusing fully on the speaker without distraction. Savoring is prompting vivid recall to deepen positive emotions.',
    examples: [
      'When a friend shares good news, ask them open-ended questions to encourage savoring.',
      'During a conversation, focus entirely on the speaker—put away your phone and maintain eye contact.'
    ],
    details: [
      'Apply ABCDE’s: Attend, Be responsive, Care, Don’t interrupt, Encourage.',
      'Celebrate Good News: Express enthusiasm and ask open-ended questions.',
      'Help Savor: Invite details to extend the positive emotion.',
      'Use Conversations A & B: Celebrate first, then follow up if concerns arise.',
      'Reflect on Patterns: Review how often you celebrate and adjust as needed.'
    ],
  link: '/skills/good_listening_celebrate_news',
  recommendedBy: 'Scotty'
}
];
