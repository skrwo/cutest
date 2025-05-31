<script setup lang="ts">
import { onMounted, ref, computed, useAttrs } from "vue"
import type { ICalculateScore, IResult, ITest } from "./types"

const props = useAttrs() as {
    test: string
    calculateScore: ICalculateScore | undefined
}

const calculateScore =
    props.calculateScore ?? ((test, result) => test.questions.length - result.checkboxes.length)

const testData = ref<ITest | null>(null)
const resultData = ref<IResult | null>(null)

const currentPath = computed(() => window?.location?.pathname ?? "")

const score = computed(() =>
    testData.value && resultData.value ? calculateScore(testData.value, resultData.value) : null,
)

const rank = computed(() =>
    score.value != null
        ? testData.value?.ranks?.find(
            (r) => r.scores[0] <= score.value! && score.value! <= r.scores[1],
        )
        : undefined,
)

onMounted(async () => {
    try {
        const res = await fetch(`./tests/${props.test}.json`)
        testData.value = await res.json()
    } catch {
        alert("Failed to load test data! :(")
    }
})

if (window.location.search) {
    const query = Array.from(new URLSearchParams(window.location.search).keys())
    if (query.at(-1) === "_") {
        resultData.value = { checkboxes: query.filter((v) => !isNaN(parseInt(v))) }
        localStorage.setItem(
            `result-${props.test}`,
            JSON.stringify(query.filter((v) => !isNaN(parseInt(v)) || v === "_")),
        )
        window.history.replaceState({}, "", `${window.location.pathname}#result`)
    }
} else if (window.location.hash === "#result") {
    const storedData = localStorage.getItem(`result-${props.test}`)
    if (!storedData) window.location.href = window.location.pathname
    else {
        const parsedData: string[] = JSON.parse(storedData)
        if (parsedData.at(-1) === "_") {
            resultData.value = { checkboxes: parsedData.slice(0, -1) }
        }
    }
}

function clearCheckboxes() {
    document
        .querySelectorAll<HTMLInputElement>("input[type=checkbox]:checked")
        .forEach((c) => (c.checked = false))
}
</script>

<template>
    <main>
        <h1 id="title">{{ testData?.title }}</h1>
        <div v-if="testData && !resultData" id="form-wrapper">
            <div id="description-wrapper">
                <p v-if="testData?.description">{{ testData.description }}</p>
            </div>
            <form method="get" action="#result">
                <h2 v-if="testData.subtitle">{{ testData.subtitle }}</h2>
                <ol>
                    <li v-for="(question, index) in testData.questions" :key="question">
                        <input type="checkbox" :id="`q${index + 1}`" :name="`${index + 1}`" value="" />
                        <label :for="`q${index + 1}`">{{ question }}</label>
                    </li>
                </ol>
                <input type="submit" value="Розрахувати результати" />
                <input type="button" value="Очистити тест" @click="clearCheckboxes" />
                <input type="hidden" name="_" value="" />
            </form>
        </div>

        <div id="result-wrapper" v-if="resultData && testData">
            <dialog :open="!rank">
                <h1>Не вдалося обробити результат тесту :(</h1>
            </dialog>
            <div v-if="rank">
                <h1>{{ rank.icon }}</h1>
                <h2>{{ score }}</h2>
                <h3>{{ rank.name }}</h3>
                <p>{{ rank.description }}</p>
                <details v-if="resultData.checkboxes.length" open>
                    <summary>Галочки</summary>
                    <p>{{ resultData.checkboxes.join(", ") }}</p>
                </details>
                <a :href="currentPath">Відкрити тест</a>
            </div>
        </div>
    </main>
</template>
