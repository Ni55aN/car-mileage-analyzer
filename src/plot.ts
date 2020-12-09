import fs from 'fs-extra'
import { join, dirname } from 'path'
import { CanvasRenderService } from 'chartjs-node-canvas'

export async function renderScatterPlot(path: string, data: { x: number, y: number }[]) {
  const canvasRenderService = new CanvasRenderService(2048, 2048, (ChartJS) => {});

  const configuration: Chart.ChartConfiguration = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Scatter Dataset',
        data
      }]
    },
    options: {

      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      }
    }
  };
  const image = await canvasRenderService.renderToBuffer(configuration);

  await fs.ensureDir(dirname(path))
  await fs.writeFile(path, image)
}