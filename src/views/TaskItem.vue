<template>
    <div class="task" :class="klass" :style="style">
        <div class="task-rendered-content" v-html="contentRendered"></div>
        <div class="d-flex justify-content-between">
            <b-button-group>
            <b-button size="sm" variant="info" @click="$emit('edit')">Редактировать</b-button>
            <b-button size="sm" variant="warning" @click="$emit('tip')">Подсказка</b-button>
                </b-button-group>
            <b-button  size="sm" variant="danger" @click="$emit('remove')">Удалить</b-button>
        </div>
    </div>
</template>

<script>
import {Prop, Vue} from "vue-property-decorator";
import Component from "vue-class-component";
import {ComplexityTypes} from "@/consts";
import marked from 'marked';

@Component({
})
export default class TaskItem extends Vue{
    @Prop() activeTask;
    @Prop() task;

    get contentRendered() {
        let text  = marked(this.task.content);
        return text
    }

    get klass() {
        let klass = ""
        switch (this.task.complexity) {
            case ComplexityTypes.undefined:
                klass = "task undefined";
                break;
            case ComplexityTypes.easy:
                klass = "task easy";
                break;
            case ComplexityTypes.medium:
                klass = "task medium";
                break;
            case ComplexityTypes.hard:
                klass = "task hard";
                break;
            case ComplexityTypes.nightmare:
                klass = "task nightmare";
                break;
        }
        return klass
    }

    get style() {
        return {
            opacity: this.activeTask == null || this.activeTask === this.task ? "100%" : "50%"
        }
    }
}
</script>

<style lang="scss">
    @import "../consts";
    .tasks-item-index {

        .index-label {
            font-size: 16px;
            //padding-top: 2px;
            height: 30px;
            width: 30px;
            text-align: center;
            border-radius: 50%;
            background: white;
            border: 2px solid;
        }
    }


    @mixin task($color, $color2) {
        background: $color;
        box-shadow: 0 0 6px lighten($color, 3);
        border-bottom: 2px solid darken($color, 20);

        &.is-not-visible {
            opacity: 0.5;
            background: lighten($color, 15);
        }

        td {
            border-color: darken($color, 20);
        }

        &:last-child {
            border-bottom: 0;
        }

        background: linear-gradient(90deg, $color, $color2);

        .tasks-item-index {
            background-color: lighten($color, 5);

            .index-label {
                color: darken($color, 40);
                border-color: darken($color, 15);
                box-shadow: 0 0 2px darken($color, 30) inset;
            }
        }

        .task-button-up {
            background-color: darken($color, 15);
            border: 1px solid darken($color, 20);
        }

        .task-button-down {
            background-color: darken($color, 15);
            border: 1px solid darken($color, 20);
        }

        .task-visible-button {
            background-color: darken($color, 25);
            border: 1px solid darken($color, 30);
            color: darken($color, 50);
            &.is-not-visible {
                background-color: transparent;
                color: darken($color, 50);
                border: none;
            }
        }

        .task-rendered-content {
            pre {
                background-color: lighten($color, 20);
                border: 1px solid $color;
                border-radius: 0.5em;
                padding: 0.5em;
            }
            img {
                max-width: 100%;
            }
        }
    }

    .task {
        transition: all 0.1s;
        padding: 1em;
        img {
            max-width: 100%;
        }
        .task-rendered-content {
            p, pre {
                margin-bottom: 0.5em;
            }

        }

        &.easy {
            @include task(#e3ff7e, #ffed6b);
        }

        &.medium {
            @include task(#ffdb5b, #ffcf25);
        }

        &.hard {
            @include task(#ff7b8f, #ffd11c);
        }

        &.nightmare {
            background-color: lighten($NIGHTMARE_COLOR, 40);
        }

        &:first-child {
            .task-button-up {
                display: none;
            }
        }

        &:last-child {
            .task-button-down {
                display: none;
            }
        }
    }
</style>