<template>
  <canvas ref='canvas'></canvas>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, watch, PropType, computed } from 'vue';
import { Chart, ChartPoint } from 'chart.js';
import { Duration } from 'luxon';
import { SubtitleEntry } from '@/subtitle/store';

export default defineComponent({
  props: {
    excerpt: {
      type: Array as PropType<SubtitleEntry[]>,
      default: () => []
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const chart = ref<null | Chart>(null);

    watch(
      [computed(() => props.excerpt), chart],
      ([excerpt,chart]) => {
        if (!chart || !chart.data?.datasets) {
          return;
        }
        chart.data.datasets = [chart.data.datasets[0], chart.data.datasets[1], ...getSubtitleDataset()];
        if (chart.options?.scales?.xAxes?.[0].ticks) {
          let triggerUpdate = false;
          if (chart.options.scales.xAxes[0].ticks.suggestedMin !== excerpt[0].from) {
            chart.options.scales.xAxes[0].ticks.suggestedMin = excerpt[0].from;
            triggerUpdate = true;
          }
          if (chart.options.scales.xAxes[0].ticks.suggestedMax !== excerpt.at(-1)?.to) {
            chart.options.scales.xAxes[0].ticks.suggestedMax = excerpt.at(-1)?.to;
            triggerUpdate = true;
          }
          if (triggerUpdate) {
            chart.update();
          }
        }
      },
      { immediate: true }
    );

    const getSubtitleDataset = () =>
      props.excerpt.map((e, i) => ({
        label: e.text,
        data: [
          { x: e.from, y: i % 2 === 0 ? 10 : 5 },
          { x: e.to, y: i % 2 === 0 ? 10 : 5 }
        ],
        backgroundColor: 'rgba(6,182,212, 0.2)',
        borderColor: 'rgba(6,182,212, 1)',
        borderWidth: 1,
        fill: false
      }));

    const videoTimePoint = { x: 0, y: 0 };
    const videoTimePointLine = { x: 0, y: 12 };
    watch(computed(() => props.currentTime), (currentTime) => {
      videoTimePoint.x = currentTime;
      videoTimePointLine.x = currentTime;
    });

    onMounted(() => {
      if (canvas.value === null) {
        return;
      }

      chart.value = new Chart(canvas.value, {
        type: 'line',
        data: {
          datasets: [
            {
              data: [videoTimePoint],
              backgroundColor: 'rgba(51,65,85, 0.2)',
              borderColor: 'rgba(51, 65, 85, 1)',
              borderWidth: 1
            },
            {
              data: [videoTimePoint, videoTimePointLine],
              backgroundColor: 'rgba(51,65,85, 0.2)',
              borderColor: 'rgba(51, 65, 85, 1)',
              borderWidth: 1,
              pointRadius: 0
            },
            ...getSubtitleDataset()
          ]
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
          },
          tooltips: {
            displayColors: false,
            callbacks: {
              title: ([{ datasetIndex, index }], { datasets }) => {
                if (datasetIndex === undefined || index === undefined || datasets === undefined) {
                  return '??';
                }
                const { x: time } = (datasets?.[datasetIndex]?.data?.[index] as ChartPoint) ?? { x: 0 };
                return Duration.fromMillis(time as number).toFormat('hh:mm:ss.SSS');
              },
              label: ({ datasetIndex }, { datasets }) => (datasetIndex ? datasets?.[datasetIndex]?.label ?? '' : '')
            }
          },
          scales: {
            xAxes: [
              {
                type: 'linear',
                ticks: {
                  display: true,
                  // suggestedMin: 0,
                  // suggestedMax: 10,
                  beginAtZero: false,
                  // maxTicksLimit: 50,
                  callback: (value) => Duration.fromMillis(value as number).toFormat('hh:mm:ss.SSS')
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  color: 'rgba(0, 0, 0, 0)'
                },
                ticks: {
                  display: false,
                  suggestedMin: 0,
                  suggestedMax: 15,
                  beginAtZero: false
                }
              }
            ]
          }
        }
      });
    });

    return {
      canvas
    };
  }
});
</script>
