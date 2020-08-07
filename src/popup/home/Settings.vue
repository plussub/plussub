<template>
  <div style="">
    <div @click="toggle"
         style="font-size: var(--card-sub-header-font-size); color: var(--default-header-text-color); display: flex;">
      <div style="flex-grow: 1">
        Subtitle Setting
      </div>
      <transition :name="show ? 'menu-more' : 'menu-less'">
        <span v-if="show"><a class="knopf flat pill sharp"><i class="fa fa-chevron-up fa-lg"></i></a></span>
        <span v-else><a class="knopf flat pill sharp"><i class="fa fa-chevron-down fa-lg"></i></a></span>
      </transition>
    </div>
    <div>
      <!--      v-show="show"-->
      <div>
        <div>Offset time</div>
        <div style="display: flex; width: 100%;">
          <div>
            <span style="font-size: 0.8em;">Actual</span>
            <input style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" :value="12"
                   type="text" disabled/>
          </div>
          <div>
            <span style="font-size: 0.8em;">New</span>
            <input ref="input" style="height: 1.5em; flex-grow: 1;" placeholder="Offset in ms" type="text"/>
          </div>
        </div>
        <div>Preview</div>
        <textarea disabled style="width: 100%; resize: none; height: 150px" :value="excerpt">
        </textarea>
        <div>
          <a class="knopf flat small" @click="setOffsetTime">Apply</a>
          <a class="knopf flat small" @click="reset">Reset</a>
        </div>
      </div>
      <div>
        Position
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';

export default {
  setup() {
    const show = ref(true)
    const excerpt = `
1
00:01:42,821 --> 00:01:44,289
(SIREN WAILING IN DISTANCE)

2
00:01:45,365 --> 00:01:48,084
<i>DRIVER: There's 100,000 streets in this city.</i>

3
00:01:49,077 --> 00:01:51,421
You don't need to know the route.

4
00:01:52,038 --> 00:01:54,132
You give me a time and a place,

5
00:01:54,207 --> 00:01:56,460
I give you a five-minute window.

6
00:01:57,168 --> 00:02:00,967
Anything happens in that five minutes and I'm yours.

7
00:02:01,046 --> 00:02:02,593
No matter what.

8
00:02:02,966 --> 00:02:05,593
Anything happens a minute either side of that

9
00:02:05,676 --> 00:02:07,553
and you're on your own.

10
00:02:08,178 --> 00:02:09,896
Do you understand?
`;

    return {
      show,
      excerpt,
      toggle() {
        this.show = !this.show;
      }
    }
  }
}
</script>
