import SimplyBookWidget from '../components/SimplyBookWidget';

const Booking = () => {
  // Get SimplyBook company ID from environment variable
  // Format: your-company-name (without .simplybook.me)
  // Default: everwellbrasil (from https://everwellbrasil.simplybook.me)
  const companyId = import.meta.env.VITE_SIMPLYBOOK_COMPANY_ID || 'everwellbrasil';
  
  // Get service ID from environment variable (optional)
  // If not provided, users can select from all available services
  // Set to null to allow users to choose from all services
  const serviceId = import.meta.env.VITE_SIMPLYBOOK_SERVICE_ID 
    ? parseInt(import.meta.env.VITE_SIMPLYBOOK_SERVICE_ID, 10) 
    : null; // null = show all services, let user choose

  return (
    <SimplyBookWidget companyId={companyId} serviceId={serviceId} />
  );
};

export default Booking;

