import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../support/db';
import { LoginPage } from '../pages/LoginPage';

test('Não deve logar quando o código de autenticação é inválido', async ({ page }) => {
  const loginPage = new LoginPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessaPagina()
  await loginPage.informaCPF(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informa2FA('123456')

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {
  const loginPage = new LoginPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessaPagina()
  await loginPage.informaCPF(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  // temporario
  await page.waitForTimeout(3000)
  const codigo = await obterCodigo2FA()

  await loginPage.informa2FA(codigo)

  // temporario
  await page.waitForTimeout(2000)

  expect(await loginPage.obterSaldo()).toHaveText('R$ 5.000,00')
});