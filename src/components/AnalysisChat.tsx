interface Message {
  role: string;
  content: string;
}

interface AnalysisChatProps {
  chatHistory: Message[];
  chatMessage: string;
  chatLoading: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AnalysisChat = ({
  chatHistory,
  chatMessage,
  chatLoading,
  onMessageChange,
  onSubmit
}: AnalysisChatProps) => {
  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold text-secondary mb-4">
        Des questions sur l'analyse?
      </h3>
      
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'assistant'
                ? 'bg-gray-50'
                : 'bg-primary text-white'
            }`}
          >
            {message.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Posez une question sur l'analyse de votre CV..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={chatLoading}
          />
          <button
            type="submit"
            disabled={chatLoading || !chatMessage.trim()}
            className={`btn-secondary ${
              chatLoading || !chatMessage.trim()
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalysisChat; 