const AdminTable = ({ users, onToggleAuthorization }) => {
  const authorizedCount = users.filter(u => u.isAuthorized).length;
  const pendingCount = users.filter(u => !u.isAuthorized).length;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex gap-4">
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded">
          <strong>{authorizedCount}</strong> Autorizados
        </div>
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded">
          <strong>{pendingCount}</strong> Pendentes
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded">
          <strong>{users.length}</strong> Total
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Cadastro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isAuthorized
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.isAuthorized ? 'Autorizado' : 'Pendente'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onToggleAuthorization(user._id)}
                  className={`${
                    user.isAuthorized
                      ? 'text-red-600 hover:text-red-900'
                      : 'text-green-600 hover:text-green-900'
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
        <div className="text-center py-8 text-gray-500">
          Nenhum usuário cadastrado ainda.
        </div>
      )}
    </div>
  );
};

export default AdminTable;

