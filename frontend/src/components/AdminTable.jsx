import { useNavigate } from 'react-router-dom';

const AdminTable = ({ users, onToggleAuthorization, onDeleteUser, sortConfig, onSort }) => {
  const navigate = useNavigate();
  const authorizedCount = users.filter(u => u.isAuthorized).length;
  const pendingCount = users.filter(u => !u.isAuthorized).length;

  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field) => {
    if (!sortConfig || sortConfig.field !== field) {
      return (
        <svg className="w-4 h-4 text-mediumTeal/40 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-primary ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Autorizados: {authorizedCount}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
          Pendentes: {pendingCount}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-mediumTeal text-xs font-medium">
          Total: {users.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-primary/20 rounded-lg">
        <table className="min-w-full divide-y divide-primary/20">
          <thead className="bg-primary/5">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-mediumTeal uppercase tracking-wider cursor-pointer hover:bg-primary/10 transition-colors duration-200 group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nome
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-mediumTeal uppercase tracking-wider cursor-pointer hover:bg-primary/10 transition-colors duration-200 group"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {getSortIcon('email')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-mediumTeal uppercase tracking-wider cursor-pointer hover:bg-primary/10 transition-colors duration-200 group"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  Tipo
                  {getSortIcon('role')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-mediumTeal uppercase tracking-wider cursor-pointer hover:bg-primary/10 transition-colors duration-200 group"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-mediumTeal uppercase tracking-wider cursor-pointer hover:bg-primary/10 transition-colors duration-200 group"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Data de Cadastro
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-mediumTeal uppercase tracking-wider">
                Autorização
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-mediumTeal uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary/20">
            {users.map((user) => (
              <tr 
                key={user._id} 
                className="hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/users/${user._id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-darkTeal">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-mediumTeal">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isAuthorized
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {user.isAuthorized ? 'Autorizado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-mediumTeal">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAuthorization(user._id);
                    }}
                    className={`inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-md transition-all min-w-[100px] ${
                      user.isAuthorized
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {user.isAuthorized ? 'Revogar' : 'Autorizar'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteUser(user._id, user.name);
                    }}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Deletar usuário"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-primary/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-darkTeal">Nenhum usuário</h3>
            <p className="mt-1 text-sm text-mediumTeal">Nenhum usuário cadastrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTable;
