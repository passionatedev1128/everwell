# Admin Blog & Feedback Management Setup

## ✅ Completed Backend

### Blog CRUD
- ✅ Added admin blog routes (`/api/blogs/admin/*`)
- ✅ Added blog controller functions:
  - `getAllBlogsAdmin` - Get all blogs (with filters)
  - `getBlogById` - Get single blog
  - `createBlog` - Create new blog
  - `updateBlog` - Update blog
  - `deleteBlog` - Delete blog
- ✅ Blog model already exists with all required fields

### Feedback Management
- ✅ Feedback model already exists
- ✅ Feedback controller already has admin functions:
  - `getAllFeedback` - Get all feedbacks (with status filter)
  - `updateFeedbackStatus` - Update feedback status
  - `deleteFeedback` - Delete feedback
- ✅ Feedback routes already configured

### Notification System
- ✅ Created `Notification` model
- ✅ Created notification controller with:
  - `getUserNotifications` - Get user's notifications
  - `markAsRead` - Mark notification as read
  - `markAllAsRead` - Mark all as read
  - `createNotification` - Create notification (admin)
  - `deleteNotification` - Delete notification
- ✅ Created notification routes (`/api/notifications`)
- ✅ Added routes to server.js

## ✅ Completed Frontend

### API Functions
- ✅ Added blog API functions to `utils/api.js`
- ✅ Added feedback API functions to `utils/api.js`
- ✅ Added notification API functions to `utils/api.js`

### Admin Page Updates
- ✅ Added blog and feedback state variables
- ✅ Added `fetchBlogs()` and `fetchFeedbacks()` functions
- ✅ Added "Blogs" and "Feedbacks" tabs
- ✅ Added blog management UI (list, edit, delete)
- ✅ Added feedback management UI (list, status filter, delete)
- ✅ Added Metronic-style comboboxes with top arrows

### Notification Bell
- ✅ Created `NotificationBell` component
- ✅ Added to Header component
- ✅ Shows unread count badge
- ✅ Dropdown with notifications list
- ✅ Marks as read when opened

## 🔧 Remaining: Blog Modal

The blog create/edit modal needs to be added to Admin.jsx. Add this after the product modal:

```jsx
{/* Blog Modal */}
{blogModal.open && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-darkTeal">
            {blogModal.mode === 'create' ? 'Novo Artigo' : 'Editar Artigo'}
          </h2>
          <button
            onClick={() => setBlogModal({ open: false, blog: null, mode: 'create' })}
            className="text-mediumTeal hover:text-darkTeal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            if (blogModal.mode === 'create') {
              await createBlog(blogForm);
              toast.success('Artigo criado!');
            } else {
              await updateBlog(blogModal.blog._id, blogForm);
              toast.success('Artigo atualizado!');
            }
            setBlogModal({ open: false, blog: null, mode: 'create' });
            fetchBlogs();
          } catch (err) {
            toast.error('Erro ao salvar artigo.');
          }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkTeal mb-2">Título *</label>
            <input
              type="text"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              className="w-full rounded-md border border-primary/30 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkTeal mb-2">Conteúdo (Markdown) *</label>
            <textarea
              value={blogForm.contentMarkdown}
              onChange={(e) => setBlogForm({ ...blogForm, contentMarkdown: e.target.value })}
              className="w-full rounded-md border border-primary/30 px-3 py-2 h-64"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkTeal mb-2">Resumo</label>
            <textarea
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              className="w-full rounded-md border border-primary/30 px-3 py-2 h-24"
              maxLength={300}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkTeal mb-2">URL da Imagem</label>
            <input
              type="url"
              value={blogForm.imageUrl}
              onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
              className="w-full rounded-md border border-primary/30 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkTeal mb-2">Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={blogForm.tags.join(', ')}
              onChange={(e) => setBlogForm({ 
                ...blogForm, 
                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
              })}
              className="w-full rounded-md border border-primary/30 px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={blogForm.published}
              onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
              className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
            />
            <label htmlFor="published" className="text-sm font-medium text-darkTeal">
              Publicar artigo
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setBlogModal({ open: false, blog: null, mode: 'create' })}
              className="px-4 py-2 text-sm font-medium text-mediumTeal hover:text-darkTeal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {blogModal.mode === 'create' ? 'Criar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
```

## 📝 Notes

- All backend routes are protected with `protect` and `requireAdmin` middleware
- Blog slug is auto-generated from title
- Feedback status can be: pending, reviewed, resolved, archived
- Notifications are user-specific and show unread count
- Metronic-style comboboxes have top arrows and are applied to all selects

