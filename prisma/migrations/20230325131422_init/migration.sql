-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoLink" TEXT,
    "description" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DanceStyles" (
    "id" SERIAL NOT NULL,
    "stile" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DanceStyles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descriptions" (
    "id" SERIAL NOT NULL,
    "videoLink" TEXT NOT NULL,
    "styleId" INTEGER NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "countOfPeople" INTEGER NOT NULL,

    CONSTRAINT "Descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterClasses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "descriptionId" INTEGER NOT NULL,
    "evenDate" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "MasterClasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescriptionsStyles" (
    "descriptionId" INTEGER NOT NULL,
    "styleId" INTEGER NOT NULL,

    CONSTRAINT "DescriptionsStyles_pkey" PRIMARY KEY ("descriptionId","styleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_key" ON "Roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterClasses" ADD CONSTRAINT "MasterClasses_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Descriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_classId_fkey" FOREIGN KEY ("classId") REFERENCES "MasterClasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptionsStyles" ADD CONSTRAINT "DescriptionsStyles_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Descriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptionsStyles" ADD CONSTRAINT "DescriptionsStyles_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "DanceStyles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
