<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { Chart, ChartPoint } from 'chart.js';
import { computed } from '@vue/reactivity';
import { SubtitleEntry } from '@/subtitle/state/types';
import { videoList } from '@/video/state';
import { useTimeUpdate } from '@/video/composable';
import { subtitleState } from '@/subtitle/state';
import Duration from 'luxon/src/duration.js';

export default defineComponent({
  props: {
    parsed: {
      type: Array as PropType<SubtitleEntry[]>,
      required: true
    }
  },
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const parsedPartial = computed(() =>
      JSON.parse(JSON.stringify(subtitleState.value.withOffsetParsed.length > 5 ? subtitleState.value.withOffsetParsed.slice(0, 5) : subtitleState.value.withOffsetParsed))
    );
    const video = computed(() => videoList.value.find((e) => e.hasSubtitle));
    const chart = ref<null | Chart>(null);

    watch(
      [parsedPartial, chart],
      () => {
        if (!parsedPartial.value || !chart.value?.data?.datasets) {
          return;
        }
        chart.value.data.datasets = [chart.value.data.datasets[0], chart.value.data.datasets[1], ...getSubtitleDataset()];

        chart.value.update();
      },
      { immediate: true }
    );

    const getSubtitleDataset = () =>
      parsedPartial.value.map((e, i) => ({
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
    if (video.value) {
      useTimeUpdate({
        video: video.value,
        fn: ({ currentTime }): void => {
          videoTimePoint.x = currentTime * 1000;
          videoTimePointLine.x = currentTime * 1000;
          chart.value?.update();
        }
      });
    }
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
              borderWidth: 1,
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
                return Duration.fromMillis(time).toFormat('hh:mm:ss.SSS');
              },
              label: ({ datasetIndex }, { datasets }) => datasetIndex ? datasets?.[datasetIndex]?.label ?? '' : ''
            }
          },
          scales: {
            xAxes: [
              {
                type: 'linear',
                ticks: {
                  display: true,
                  suggestedMin: 0,
                  suggestedMax: 10,
                  beginAtZero: true,
                  callback: (value) => Duration.fromMillis(value).toFormat('hh:mm:ss.SSS')
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
                  beginAtZero: true,
                  callback: (value) => Duration.fromMillis(value).toFormat('hh:mm:ss.SSS')
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
