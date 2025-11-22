import SimplyBookWidget from '../components/SimplyBookWidget';

const Booking = () => {
  // Get SimplyBook company ID from environment variable
  // Format: your-company-name (without .simplybook.me)
  // Default: everwellbrasil (from https://everwellbrasil.simplybook.me)
  const companyId = import.meta.env.VITE_SIMPLYBOOK_COMPANY_ID || 'everwellbrasil';

  return (
    <SimplyBookWidget companyId={companyId} serviceId={1} />
  );
};

export default Booking;

