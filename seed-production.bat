@echo off
echo Seeding production database...
cd apps/api
set DATABASE_URL=postgresql://lead_management:GeHfV8vhlHPEGRiX3xw7NM1jvxsHrGuA@dpg-d608qti4d50c73cnbnhg-a.singapore-postgres.render.com/lead_management_sbjf
npm run db:seed
cd ../..
echo Done! You can now delete this file and apps/api/.env.production
pause
