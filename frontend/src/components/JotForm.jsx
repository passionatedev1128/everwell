const JotForm = ({ formId = '252618050339051', height = '800px' }) => {
  return (
    <div className="w-full">
      <iframe
        id={`JotFormIFrame-${formId}`}
        title="JotForm"
        src={`https://form.jotform.com/${formId}`}
        style={{
          minWidth: '100%',
          maxWidth: '100%',
          height: height,
          border: 'none',
        }}
        allow="geolocation; microphone; camera"
        allowTransparency="true"
        scrolling="no"
        className="w-full"
      />
    </div>
  );
};

export default JotForm;

