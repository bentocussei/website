import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');
  
  // Criar um usuário admin
  const adminPassword = await bcrypt.hash('rscg*admin.123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ratotecki.com' },
    update: {},
    create: {
      email: 'admin@ratotecki.com',
      name: 'Administrador',
      password: adminPassword,
      isAdmin: true,
    },
  });
  
  console.log('Usuário admin criado:', admin.email);
  
  // Criar algumas notícias de exemplo
  // const newsItems = [
  //   {
  //     title: 'Lançamento da Plataforma',
  //     date: '10 de Maio, 2024',
  //     summary: 'Nova plataforma de virtual twins para otimização de redes elétricas',
  //     content: '<p>Temos o prazer de anunciar o lançamento oficial de nossa plataforma revolucionária de virtual twins.</p><p>Esta tecnologia permite simular e otimizar redes elétricas com precisão sem precedentes.</p>',
  //     image: '/images/news/launch.jpg',
  //   },
  //   {
  //     title: 'Parceria Estratégica',
  //     date: '15 de Maio, 2024',
  //     summary: 'Parceria com principais distribuidoras de energia',
  //     content: '<p>Anunciamos hoje uma parceria estratégica com três das maiores distribuidoras de energia do país.</p><p>Esta colaboração permitirá implementar nossa tecnologia em escala nacional.</p>',
  //     image: '/images/news/partnership.jpg',
  //   },
  // ];
  
  // for (const news of newsItems) {
  //   await prisma.news.upsert({
  //     where: { title: news.title },
  //     update: {},
  //     create: news,
  //   });
  // }
  
  // console.log(`${newsItems.length} notícias criadas`);
  
  // Criar alguns itens na lista de espera
  // const waitingListItems = [
  //   {
  //     email: 'empresa1@exemplo.com',
  //     name: 'João Silva',
  //     companyName: 'Empresa de Energia 1',
  //     productName: 'Virtual Twin Básico',
  //     isDemoRequest: true,
  //   },
  //   {
  //     email: 'empresa2@exemplo.com',
  //     name: 'Maria Santos',
  //     companyName: 'Distribuidora 2',
  //     productName: 'Virtual Twin Avançado',
  //     isDemoRequest: false,
  //   },
  // ];
  
  // for (const item of waitingListItems) {
  //   await prisma.waitingList.upsert({
  //     where: { email: item.email },
  //     update: {},
  //     create: item,
  //   });
  // }
  
  // console.log(`${waitingListItems.length} itens criados na lista de espera`);
  
  // Criar algumas mensagens de contato
  // const contactMessages = [
  //   {
  //     name: 'Carlos Oliveira',
  //     email: 'carlos@exemplo.com',
  //     subject: 'Dúvida sobre integração',
  //     message: 'Gostaria de saber como integrar o sistema com nosso ERP existente.',
  //   },
  //   {
  //     name: 'Ana Pereira',
  //     email: 'ana@exemplo.com',
  //     subject: 'Solicitação de orçamento',
  //     message: 'Estamos interessados em implementar sua solução. Poderiam me enviar um orçamento para 50 usuários?',
  //   },
  // ];
  
  // for (const message of contactMessages) {
  //   await prisma.contactMessage.create({
  //     data: message,
  //   });
  // }
  
  // console.log(`${contactMessages.length} mensagens de contato criadas`);
  
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 