const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// In-memory projects store (replace with database)
let projects = [];

// Get all projects for user
router.get('/', verifyToken, (req, res) => {
  const userProjects = projects.filter(p => p.userId === req.user.userId);
  res.json({ projects: userProjects });
});

// Create new project
router.post('/', verifyToken, (req, res) => {
  try {
    const { name, description, type, region } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.userId,
      name,
      description: description || '',
      type,
      region: region || 'us-central1',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      services: [],
      deployments: []
    };

    projects.push(project);

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project by ID
router.get('/:projectId', verifyToken, (req, res) => {
  const project = projects.find(p => 
    p.id === req.params.projectId && p.userId === req.user.userId
  );

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json({ project });
});

// Update project
router.put('/:projectId', verifyToken, (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => 
      p.id === req.params.projectId && p.userId === req.user.userId
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { name, description, region } = req.body;
    const project = projects[projectIndex];

    // Update fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (region) project.region = region;
    project.updatedAt = new Date().toISOString();

    projects[projectIndex] = project;

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Project update error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:projectId', verifyToken, (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => 
      p.id === req.params.projectId && p.userId === req.user.userId
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projects.splice(projectIndex, 1);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Project deletion error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
