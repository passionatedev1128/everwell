const AdminTable = ({ users, onToggleAuthorization }) => {
  const authorizedCount = users.filter(u => u.isAuthorized).length;
  const pendingCount = users.filter(u => !u.isAuthorized).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <span className="badge badge-success shadow-sm">Autorizados {authorizedCount}</span>
        <span className="badge badge-warning shadow-sm">Pendentes {pendingCount}</span>
        <span className="badge badge-info shadow-sm">Total {users.length}</span>
      </div>

      <div className="overflow-x-auto glass-panel p-0">
        <table className="min-w-full divide-y divide-white/40">
          <thead className="bg-white/60">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.35em] text-darkTeal/60">
                Nome
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.35em] text-darkTeal/60">
                Email
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.35em] text-darkTeal/60">
                Status
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.35em] text-darkTeal/60">
                Cadastro
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.35em] text-darkTeal/60">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-white/40">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-white/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-darkTeal">{user.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-mediumTeal">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                      user.isAuthorized
                        ? 'bg-primary/10 text-primary'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {user.isAuthorized ? 'Autorizado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-mediumTeal">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => onToggleAuthorization(user._id)}
                    className={`text-sm font-semibold ${
                      user.isAuthorized
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-primary hover:text-primary-dark'
                    }`}
                  >
                    {user.isAuthorized ? 'Desautorizar' : 'Autorizar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-mediumTeal">
            Nenhum usuário cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTable;

