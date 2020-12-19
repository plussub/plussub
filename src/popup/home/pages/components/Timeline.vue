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
import { subtitleState, setOffsetTime } from '@/subtitle/state';

export default defineComponent({
  props: {
    parsed: {
      type: Array as PropType<SubtitleEntry[]>,
      required: true
    }
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const parsedPartial = computed(() =>
      JSON.parse(JSON.stringify(subtitleState.value.withOffsetParsed.length > 5 ? subtitleState.value.withOffsetParsed.slice(0, 5) : subtitleState.value.withOffsetParsed))
    );
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
      () => {
        parsedPartial.value.forEach((e, i) => {
          subtitleTimeEntry[i].timePoint[0].x = e.from;
          subtitleTimeEntry[i].timePoint[1].x = e.to;
        });
        if (chart) {
          chart.update();
        }
      }
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
                  beginAtZero: true
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
