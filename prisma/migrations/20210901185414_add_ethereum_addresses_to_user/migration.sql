-- CreateTable
CREATE TABLE "EthereumAccount" (
    "address" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("address")
);

-- AddForeignKey
ALTER TABLE "EthereumAccount" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
