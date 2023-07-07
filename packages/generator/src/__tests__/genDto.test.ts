import { getSampleDMMF } from './__fixtures__/getSampleDMMF';
import { genDto } from '../generators';

test('dto generation', async () => {
  const sampleDMMF = await getSampleDMMF();

  sampleDMMF.datamodel.models.forEach((table) => {
    expect(genDto(table)).toMatchSnapshot(table.name);
  });
});
