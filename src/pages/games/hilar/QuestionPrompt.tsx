import { useState } from 'react';

interface QuestionPromptProps {
  prompt: string;
  submitCallback: (response: string) => void;
}

function QuestionPrompt(props: QuestionPromptProps) {
  const [responseText, setResponseText] = useState<string>('');
  const handleSubmitQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    // Don't reload
    e.preventDefault();

    // Get the response field
    const response = responseText;

    // Remove the text from the input box
    setResponseText('');

    // Call back the provided function
    props.submitCallback(response);
  };

  return (
    <form
      method='post'
      className='question-prompt'
      onSubmit={handleSubmitQuestion}
    >
      <h2>{props.prompt}</h2>
      <input
        type='text'
        name='response'
        id='response'
        value={responseText}
        onChange={(e) => setResponseText(e.currentTarget.value)}
      />
      <button type='submit'>Submit Answer</button>
    </form>
  );
}

export default QuestionPrompt;
