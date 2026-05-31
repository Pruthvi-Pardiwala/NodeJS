const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

let tasks = [
  { id: 1, title: "Prepare Weekly Report", description: "Complete the weekly project status report for stakeholders", priority: "High", status: "Completed" },
  { id: 2, title: "Review Pull Requests", description: "Review and merge pending pull requests from team members", priority: "High", status: "In Progress" },
  { id: 3, title: "Update Documentation", description: "Update API docs with latest endpoint changes", priority: "Medium", status: "Pending" },
  { id: 4, title: "Team Meeting Notes", description: "Write and distribute meeting notes from Monday standup", priority: "Low", status: "Pending" },
];
let nextId = 5;

function getStats() {
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };
}

app.get('/', (req, res) => {
  const alert = req.query.alert || null;
  const alertType = req.query.type || 'success';
  res.render('dashboard', { tasks, stats: getStats(), alert, alertType });
});

app.get('/add', (req, res) => {
  res.render('add-task', { error: null });
});

app.post('/add', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !title.trim()) {
    return res.render('add-task', { error: 'Task title is required.' });
  }
  const task = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    priority: priority || 'Medium',
    status: 'Pending',
  };
  tasks.push(task);
  res.redirect('/?alert=Task+added+successfully&type=success');
});

app.get('/edit/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.redirect('/?alert=Task+not+found&type=danger');
  res.render('edit-task', { task, error: null });
});

app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.redirect('/?alert=Task+not+found&type=danger');

  const { title, description, priority, status } = req.body;
  if (!title || !title.trim()) {
    return res.render('edit-task', { task: tasks[idx], error: 'Task title is required.' });
  }
  tasks[idx] = { ...tasks[idx], title: title.trim(), description: description ? description.trim() : '', priority, status };
  res.redirect('/?alert=Task+updated+successfully&type=success');
});

app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  const msg = tasks.length < before ? 'Task+deleted+successfully' : 'Task+not+found';
  const type = tasks.length < before ? 'success' : 'danger';
  res.redirect(`/?alert=${msg}&type=${type}`);
});

app.post('/status/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.redirect('/?alert=Task+not+found&type=danger');

  const flow = { 'Pending': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Pending' };
  task.status = flow[task.status];
  res.redirect('/?alert=Status+updated&type=info');
});

app.listen(PORT, () => {
  console.log(`✅ TodoApp running at http://localhost:${PORT}`);
});