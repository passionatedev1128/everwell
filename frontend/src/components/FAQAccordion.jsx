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
        // Fallback to default FAQs
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
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-text-dark">{faq.question}</span>
            <span className="text-2xl text-primary">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 bg-gray-50 text-gray-700">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;

