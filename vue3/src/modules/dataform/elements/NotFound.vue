<template>
    <a-form-item :label=label :rules=rule>
        <div>{{ lang.notFound }}</div>
    </a-form-item>
</template>

<script>

export default {
    props: ["model", "rule", "label", "meta"],
    computed: {
        lang() {
            const labels = ['notFound',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {

    },
};
</script>
