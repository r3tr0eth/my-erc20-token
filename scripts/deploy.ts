import { ethers } from "hardhat";

async function main() {
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();

  console.log("Deploying MyToken...");
  // Esperar a que el contrato se despliegue completamente
  const deployedToken = await myToken.waitForDeployment();
  
  // Obtener la dirección del contrato desplegado
  const tokenAddress = await deployedToken.getAddress();

  console.log(`MyToken deployed to: ${tokenAddress}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });