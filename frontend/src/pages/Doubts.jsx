import FAQAccordion from '../components/FAQAccordion';

const Doubts = () => {
  return (
    <div className="min-h-screen bg-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          Dúvidas Frequentes
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Encontre respostas para as perguntas mais comuns sobre nossos produtos e serviços.
        </p>
        <FAQAccordion />
      </div>
    </div>
  );
};

export default Doubts;

