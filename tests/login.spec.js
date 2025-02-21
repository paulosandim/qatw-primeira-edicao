import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../support/db';

test('Não deve logar quando o código de autenticação é inválido', async ({ page }) => {
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await page.goto('http://paybank-mf-auth:3000/');

  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  for (const digito of usuario.senha) {
    await page.getByRole('button', { name: digito }).click();
  }
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await page.goto('http://paybank-mf-auth:3000/');

  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  for (const digito of usuario.senha) {
    await page.getByRole('button', { name: digito }).click();
  }
  await page.getByRole('button', { name: 'Continuar' }).click();

  // temporario
  await page.waitForTimeout(3000)

  const code = await obterCodigo2FA()

  await page.getByRole('textbox', { name: '000000' }).fill(code);
  await page.getByRole('button', { name: 'Verificar' }).click();

  // temporario
  await page.waitForTimeout(2000)

  await expect(page.locator('#account-balance')).toContainText('R$ 5.000,00');
});