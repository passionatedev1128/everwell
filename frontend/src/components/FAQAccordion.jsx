import { useState, useEffect } from 'react';
import api from '../utils/api';

const FAQAccordion = ({ isVisible = false }) => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/faqs');
        setFaqs(response.data.faqs || []);
      } catch (error) {
        // Only log error if it's not a connection refused error (backend not running)
        // Connection refused is expected when backend is not running, and we have fallback FAQs
        if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
          console.error('Error fetching FAQs:', error);
        }
        // Use fallback FAQs when backend is unavailable
        setFaqs([
          {
            question: 'O que é Cannabis Medicinal ?',
            answer: 'A cannabis medicinal refere-se ao uso de componentes da planta Cannabis para fins terapêuticos, sob prescrição e acompanhamento médico.'
          },
          {
            question: 'Quais os principais benefícios dos produtos?',
            answer: 'Os produtos à base de CBD podem ajudar no bem-estar, performance, recuperação e equilíbrio mental e físico.'
          },
          {
            question: 'Preciso de receita médica para comprar os produtos da EverWell?',
            answer: 'Sim. Todos os produtos são restritos conforme RDC 327/2019 e 660/2022 da Anvisa e requerem prescrição médica e autorização.'
          },
          {
            question: 'Como funciona as etapas de consulta e tratamento?',
            answer: 'Primeiro você agenda uma consulta médica, depois obtém a autorização da Anvisa, e então podemos proceder com a importação e entrega dos produtos.'
          },
          {
            question: 'Qual o valor da consulta e autorização da Anvisa?',
            answer: 'Entre em contato conosco ou consulte o profissional de saúde para informações sobre valores e processos.'
          },
          {
            question: 'Qual a validade da prescrição?',
            answer: 'A validade da prescrição médica varia conforme a indicação do profissional. Consulte seu médico para mais informações.'
          },
          {
            question: 'Qual é o prazo de entrega dos produtos',
            answer: 'O prazo de entrega varia conforme a localização e processo de importação. Geralmente entre 15 a 30 dias úteis após a autorização.'
          }
        ]);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out border border-primary/10"
          style={{
            boxShadow: openIndex === index 
              ? '0 12px 40px rgba(192, 223, 22, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)' 
              : '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
            animation: isVisible ? `faqSlideInFromLeft 0.6s ease-out ${index * 0.1}s forwards` : 'none',
            opacity: isVisible ? 0 : 1
          }}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 md:px-8 py-6 flex items-start justify-between gap-6 text-left transition-all duration-300 group"
          >
            <div className="flex-1 min-w-0">
              <h3 
                className={`font-semibold text-base md:text-lg leading-snug transition-colors duration-300 ${
                  openIndex === index ? 'text-primary' : 'text-primary group-hover:text-gray-500'
                }`}
                style={{ letterSpacing: '-0.01em' }}
              >
                {faq.question}
              </h3>
            </div>
            <div className="flex-shrink-0 mt-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${
                  openIndex === index 
                    ? 'bg-primary text-white rotate-180' 
                    : 'bg-primary/5 text-primary hover:bg-primary hover:primary-color-text-white'
                }`}
              >
                <svg 
                  className="w-5 h-5 transition-transform duration-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>
          {openIndex === index && (
            <div 
              className="px-6 md:px-8 pb-6 border-t border-primary/10"
              style={{
                animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <p className="pt-4 text-mediumTeal leading-relaxed text-sm md:text-base">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
