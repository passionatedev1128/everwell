import SimplyBookWidget from '../components/SimplyBookWidget';

const Booking = () => {
  // Get SimplyBook company ID from environment variable
  // Format: your-company-name (without .simplybook.me)
  const companyId = import.meta.env.VITE_SIMPLYBOOK_COMPANY_ID || 'everwell';

  return (
    <SimplyBookWidget companyId={companyId} />
  );
};

export default Booking;

