export const handleCronjob = async (dependencies) => {
  await dependencies.emailService.sendAllEmail();
};
