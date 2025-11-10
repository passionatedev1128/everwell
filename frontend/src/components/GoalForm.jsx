import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { trackLead as gaTrackLead } from '../utils/analytics';
import { trackLead as hsTrackLead } from '../utils/hubspot';

const initialState = {
  name: '',
  email: '',
  phone: '',
  objective: '',
  timeline: '',
  currentChallenges: '',
  medicalBackground: '',
  supportPreference: 'consultoria-personalizada',
  message: '',
};

const objectiveOptions = [
  'Foco e performance',
  'Recuperação muscular',
  'Gestão do estresse',
  'Sono e equilíbrio',
  'Controle de dor',
  'Outros',
];

const timelineOptions = [
  'Quero resultados imediatos',
  '1 a 3 meses',
  '3 a 6 meses',
  'Plano anual',
];

const supportOptions = [
  { value: 'consultoria-personalizada', label: 'Consultoria personalizada com especialista' },
  { value: 'protocolo-digital', label: 'Protocolos digitais com acompanhamento remoto' },
  { value: 'workshop-corporativo', label: 'Programa corporativo / time esportivo' },
  { value: 'nao-decidi', label: 'Ainda estou avaliando' },
];

const GoalForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.objective.trim()) {
      toast.error('Preencha nome, email e objetivo principal.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/leads/goals', formData);
      if (response.data?.success) {
        toast.success('Recebemos seus objetivos! Entraremos em contato em breve.');
        gaTrackLead('goal_form');
        hsTrackLead('goal_form');
        setFormData(initialState);
      } else {
        toast.error(response.data?.message || 'Não foi possível enviar o formulário.');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário de objetivos:', error);
      toast.error('Não foi possível enviar o formulário. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-darkTeal mb-2">Mapeie sua melhor versão</h3>
        <p className="text-sm text-mediumTeal">
          Preencha o formulário e nossa equipe especializada fará contato para definir o protocolo ideal.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="name">
              Nome completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Ana Souza"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@everwell.com"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="phone">
              Telefone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(21) 99999-9999"
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="objective">
              Objetivo principal *
            </label>
            <select
              id="objective"
              name="objective"
              className="input-field"
              value={formData.objective}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {objectiveOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="timeline">
              Horizonte de resultados esperado
            </label>
            <select
              id="timeline"
              name="timeline"
              className="input-field"
              value={formData.timeline}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="supportPreference">
              Qual suporte você prefere?
            </label>
            <select
              id="supportPreference"
              name="supportPreference"
              className="input-field"
              value={formData.supportPreference}
              onChange={handleChange}
            >
              {supportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="currentChallenges">
            Desafios atuais
          </label>
          <textarea
            id="currentChallenges"
            name="currentChallenges"
            rows={3}
            className="input-field"
            placeholder="Compartilhe seu cenário atual, pontos de atenção e principais obstáculos."
            value={formData.currentChallenges}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="medicalBackground">
            Histórico médico / tratamentos em andamento
          </label>
          <textarea
            id="medicalBackground"
            name="medicalBackground"
            rows={3}
            className="input-field"
            placeholder="Informe se possui diagnósticos, tratamentos ou medicamentos ativos."
            value={formData.medicalBackground}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="message">
            Como podemos ajudar você além do objetivo principal?
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="input-field"
            placeholder="Conte mais sobre sua rotina, desafios ou perguntas específicas."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <p className="text-xs text-mediumTeal max-w-2xl">
            Ao enviar, você concorda em receber contato da equipe EverWell. Seus dados são tratados com confidencialidade
            seguindo LGPD.
          </p>
          <button type="submit" className={`btn-primary ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar formulário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;


