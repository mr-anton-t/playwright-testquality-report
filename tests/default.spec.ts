import { expect, test } from '@playwright/test';

 test.describe('default',async () => {
   test('initial stats @TC4964', async () => {
     expect(true).toEqual(true);
   });

   // test('initial stats @TC1003 @regress', async () => {
   //   expect(true).toEqual(false);
   // });
   //
   // test.skip('initial stats @TC2345 @TC33435 @smoke', async () => {
   //   expect(true).toEqual(true);
   // });
});
