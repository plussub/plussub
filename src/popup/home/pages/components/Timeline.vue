<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { Chart } from 'chart.js';
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
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const parsedPartial = computed(() => {
      try {
        return JSON.parse(JSON.stringify(subtitleState.value.withOffsetParsed.length > 5 ? subtitleState.value.withOffsetParsed.slice(0, 5) : subtitleState.value.withOffsetParsed));
      } catch (e) {
        console.warn(e);
        return [] as SubtitleEntry[];
      }
    });
    const video = computed(() => videoList.value.find((e) => e.hasSubtitle));
    const videoTimePoint = { x: 0, y: 0 };
    const subtitleTimeEntry = parsedPartial.value.map((e, i) => ({
      text: e.text,
      timePoint: [
        { x: e.from, y: i % 2 === 0 ? 10 : -10 },
        { x: e.to, y: i % 2 === 0 ? 10 : -10 }
      ]
    }));

    let chart: null | Chart = null;
    watch(
      () => parsedPartial.value,
      (val) => {
        if (!val || !chart || !chart.data || !chart.data.datasets) {
          return;
        }
        console.warn(chart.data.datasets);
        try {
          chart.data.datasets = [
            chart.data.datasets[0],
            ...val.map((e, i) => ({
              label: e.text,
              data: [
                { x: e.from, y: i % 2 === 0 ? 10 : -10 },
                { x: e.to, y: i % 2 === 0 ? 10 : -10 }
              ],
              backgroundColor: 'rgba(6,182,212, 0.2)',
              borderColor: 'rgba(6,182,212, 1)',
              borderWidth: 1
            }))
          ];
        } catch (e) {
          console.warn(e);
        }
        chart.update();
      },
      { immediate: true }
    );

    if (video.value) {
      useTimeUpdate({
        video: video.value,
        fn: ({ currentTime }): void => {
          videoTimePoint.x = currentTime * 1000;
          if (chart) {
            chart.update();
          }
        }
      });
    }
    onMounted(() => {
      if (canvas.value === null) {
        return;
      }

      chart = new Chart(canvas.value, {
        type: 'line',
        data: {
          datasets: [
            {
              data: [videoTimePoint],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            ...subtitleTimeEntry.map((e) => ({
              label: e.text,
              data: e.timePoint,
              backgroundColor: 'rgba(6,182,212, 0.2)',
              borderColor: 'rgba(6,182,212, 1)',
              borderWidth: 1
            }))
          ]
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
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
                  suggestedMin: -15,
                  suggestedMax: 15,
                  beginAtZero: true
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
