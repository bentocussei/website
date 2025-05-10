import { prisma } from "@/lib/prisma";

interface LogActivityOptions {
  userId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  details?: any | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
  userAgent,
}: LogActivityOptions): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || undefined, // Prisma espera undefined para omissão, ou null se explicitamente permitido e desejado
        action,
        entityType: entityType || undefined,
        entityId: entityId || undefined,
        details: details || undefined, // Prisma lida com Json? como opcional, pode ser undefined
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
      },
    });
    console.log(`Activity logged: ${action}`, { userId, entityType, entityId }); // Log para o console do servidor para debug
  } catch (error) {
    console.error("Failed to log activity:", {
      action,
      userId,
      entityType,
      entityId,
      error,
    });
    // Decidir se deve-se lançar o erro ou falhar silenciosamente para não impactar a operação principal.
    // Por enquanto, falha silenciosamente no contexto do log, mas loga o erro no console do servidor.
  }
} 