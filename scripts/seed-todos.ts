import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding todos...');

  // 1. Get users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found. Please seed users first.');
    return;
  }

  // 2. Create Todo Groups
  const groupsData = [
    { name: 'Sales Pipeline', description: 'Tracking active deals and follow-ups', color: 'blue' },
    { name: 'Marketing Campaigns', description: 'Content creation and ad management', color: 'purple' },
    { name: 'Product Engineering', description: 'Bugs, features, and deployments', color: 'emerald' },
    { name: 'Customer Success', description: 'Onboarding and support coordination', color: 'amber' },
  ];

  const groups = [];
  for (const groupData of groupsData) {
    const group = await prisma.todoGroup.upsert({
      where: { name: groupData.name },
      update: {},
      create: groupData,
    });
    groups.push(group);
  }

  // 3. Create Todos
  const todosData = [
    { 
      title: 'Follow up with TechFlow Solutions', 
      description: 'Discuss the proposal for cloud migration services.', 
      priority: 'High', 
      status: 'Pending', 
      groupName: 'Sales Pipeline',
      dueDate: new Date(Date.now() + 86400000 * 2) // 2 days from now
    },
    { 
      title: 'Review weekly ad performance', 
      description: 'Analyze CTR and conversion rates for Google Ads.', 
      priority: 'Medium', 
      status: 'In Progress', 
      groupName: 'Marketing Campaigns',
      dueDate: new Date(Date.now() + 86400000) // 1 day from now
    },
    { 
      title: 'Fix sidebar navigation bug', 
      description: 'Dropdowns are collapsing on route changes.', 
      priority: 'Urgent', 
      status: 'Pending', 
      groupName: 'Product Engineering',
      dueDate: new Date(Date.now() - 86400000) // 1 day ago (overdue)
    },
    { 
      title: 'Onboard Global Trade Corp', 
      description: 'Kick-off meeting and account setup.', 
      priority: 'High', 
      status: 'Completed', 
      groupName: 'Customer Success',
      dueDate: new Date(Date.now() - 86400000 * 3) // 3 days ago
    },
    { 
      title: 'Draft quarterly report', 
      description: 'Prepare data for the board meeting.', 
      priority: 'Medium', 
      status: 'Pending', 
      groupName: 'Sales Pipeline',
      dueDate: new Date(Date.now() + 86400000 * 5)
    }
  ];

  for (const todoData of todosData) {
    const group = groups.find(g => g.name === todoData.groupName);
    if (!group) continue;

    await prisma.todo.create({
      data: {
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority,
        status: todoData.status,
        dueDate: todoData.dueDate,
        groupId: group.id,
        assignees: {
          connect: users.slice(0, 2).map(u => ({ id: u.id }))
        }
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
