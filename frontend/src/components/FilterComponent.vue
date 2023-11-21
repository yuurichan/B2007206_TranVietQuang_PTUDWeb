<template>
  <div class="card border mb-2">
    <h5 class="card-header">{{ $props.title }}</h5>

    <div class="card-body">
      <div class="mb-3">
        <label class="form-label"> Tìm kiếm theo </label>
        <select class="form-select" v-model="searchBy">
          <option v-for="item in $props.items" :key="item.name" :value="item.name">
            {{ item.title }}
          </option>
        </select>
      </div>

      <input type="text" placeholder="Từ khóa" class="form-control" v-model="term" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FilterComponent',
  props: {
    modelValue: {
      type: Object
    },
    items: {
      type: Array
    },
    title: {
      type: String
    }
  },
  data() {
    const timeout = ref(null)

    return {
      searchBy: this.$props.modelValue.searchBy,
      term: this.$props.modelValue.term,
      timeout
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitModelValue() {
      window.clearTimeout(this.timeout)

      this.timeout = window.setTimeout(() => {
        this.$emit('update:modelValue', { searchBy: this.searchBy, term: this.term })
      }, 500)
    }
  },
  watch: {
    searchBy() {
      this.emitModelValue()
    },
    term() {
      this.emitModelValue()
    }
  }
}
</script>
