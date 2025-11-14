import { useState, useEffect } from 'react';
import api from '../utils/api';

const FAQAccordion = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/faqs');
        setFaqs(response.data.faqs || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
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
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="glass-panel overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 md:px-8 py-5 flex items-center justify-between gap-6 text-left hover:bg-primary/5 transition-colors"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-1">Pergunta</p>
              <span className="font-semibold text-lg text-darkTeal leading-snug">{faq.question}</span>
            </div>
            <span
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 text-primary transition-all duration-300 ${
                openIndex === index ? 'bg-primary/15 rotate-90 scale-110' : 'hover:bg-primary/10 hover:scale-105'
              }`}
            >
              {openIndex === index ? '×' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-6 md:px-8 pb-6 text-darkTeal/80 leading-relaxed border-t border-white/40 bg-white/60 animate-fade-in">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;

