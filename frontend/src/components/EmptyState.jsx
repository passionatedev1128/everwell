// Empty state components for better UX

const EmptyState = ({ 
  icon = '📦', 
  title, 
  description, 
  actionLabel, 
  actionHref,
  actionOnClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center animate-fade-in">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold text-darkTeal mb-2 font-heading">
        {title}
      </h3>
      <p className="text-mediumTeal mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref} className="btn-primary">
            {actionLabel}
          </a>
        ) : actionOnClick ? (
          <button onClick={actionOnClick} className="btn-primary">
            {actionLabel}
          </button>
        ) : null
      )}
    </div>
  );
};

export const EmptyCart = () => (
  <EmptyState
    icon="🛒"
    title="Seu carrinho está vazio"
    description="Adicione produtos ao carrinho para começar sua compra."
    actionLabel="Ver Produtos"
    actionHref="/produtos"
  />
);

export const EmptyOrders = () => (
  <EmptyState
    icon="📋"
    title="Nenhum pedido encontrado"
    description="Você ainda não realizou nenhum pedido. Quando fizer seu primeiro pedido, ele aparecerá aqui."
    actionLabel="Ver Produtos"
    actionHref="/produtos"
  />
);

export const EmptyProducts = () => (
  <EmptyState
    icon="🔍"
    title="Nenhum produto encontrado"
    description="Não encontramos produtos com os filtros selecionados. Tente ajustar sua busca."
  />
);

export const EmptySearch = ({ onClear }) => (
  <EmptyState
    icon="🔍"
    title="Nenhum resultado encontrado"
    description="Não encontramos resultados para sua busca. Tente usar outros termos ou limpar os filtros."
    actionLabel="Limpar Filtros"
    actionOnClick={onClear}
  />
);

export const EmptyDocuments = () => (
  <EmptyState
    icon="📄"
    title="Nenhum documento enviado"
    description="Você ainda não enviou nenhum documento. Faça upload dos documentos necessários para continuar."
  />
);

export default EmptyState;

