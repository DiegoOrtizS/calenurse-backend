import pandas as pd
from collections import deque
from openpyxl import load_workbook
import random
import json
import sys

# Función para leer los datos del archivo Excel


def leer_datos_excel(ruta_archivo):
    # Cargar el libro de trabajo y las hojas
    libro = load_workbook(filename=ruta_archivo)
    hoja_pref = libro['Turnos']
    hoja_libres = libro['DiasLibres']
    hoja_turnos = libro['EnfermerasPorTurno']

    # Leer las preferencias de las enfermeras
    preferencias = pd.DataFrame(hoja_pref.values)
    preferencias.columns = preferencias.iloc[0]
    preferencias = preferencias.drop(0)
    preferencias = preferencias.set_index('Enfermera').T.to_dict('list')

    # Leer los días libres de las enfermeras
    dias_libres = pd.DataFrame(hoja_libres.values)
    dias_libres.columns = dias_libres.iloc[0]
    dias_libres = dias_libres.drop(0)
    dias_libres = dias_libres.set_index('Enfermera').to_dict()['Dia Libre']

    # Leer la cantidad de enfermeras por turno
    enfermeras_por_turno = pd.DataFrame(hoja_turnos.values)
    enfermeras_por_turno = enfermeras_por_turno.iloc[1, 0:].tolist()

    return preferencias, dias_libres, enfermeras_por_turno

# Función para generar la asignación de turnos usando Round Robin


def generar_asignacion_turnos_round_robin(preferencias, dias_libres, enfermeras_por_turno):
    num_dias = len(next(iter(preferencias.values())))
    num_turnos_por_dia = len(enfermeras_por_turno)
    # Diccionario para la asignación por enfermera
    asignacion_por_enfermera = {enfermera: [
        None] * num_dias for enfermera in preferencias}

    cola_enfermeras = deque(preferencias.keys())

    # Asignar los días libres primero
    for enfermera, dia_libre in dias_libres.items():
        # Los días se cuentan desde 1 en el input
        asignacion_por_enfermera[enfermera][dia_libre - 1] = 0

    for dia in range(num_dias):
        enfermeras_disponibles = set(preferencias.keys()) - set(enfermera for enfermera,
                                                                dia_libre in dias_libres.items() if dia_libre-1 == dia)  # Excluir enfermeras con día libre
        for turno in range(num_turnos_por_dia):
            turno_actual = turno + 1
            enfermeras_turno = []

            # Priorizar las preferencias
            for enfermera, dias in preferencias.items():
                if dias[dia] == turno_actual and enfermera in enfermeras_disponibles and len(enfermeras_turno) < enfermeras_por_turno[turno]:
                    enfermeras_turno.append(enfermera)
                    # La enfermera ya no está disponible para otros turnos ese día
                    enfermeras_disponibles.remove(enfermera)

            # Completar con Round Robin si es necesario
            while len(enfermeras_turno) < enfermeras_por_turno[turno] and enfermeras_disponibles:
                enfermera_actual = cola_enfermeras[0]
                if enfermera_actual in enfermeras_disponibles:
                    enfermeras_turno.append(enfermera_actual)
                    enfermeras_disponibles.remove(enfermera_actual)
                cola_enfermeras.rotate(-1)

            # Asignar el turno a las enfermeras seleccionadas y actualizar la asignación por enfermera
            for enfermera in enfermeras_turno:
                asignacion_por_enfermera[enfermera][dia] = turno_actual

    # Asegurar que no hay None en la asignación final, si hay, asignar un turno disponible
    for enfermera, turnos in asignacion_por_enfermera.items():
        for dia in range(num_dias):
            if turnos[dia] is None:  # Si hay un turno no asignado, asignar un turno disponible
                # Encontrar los turnos ya ocupados en ese día
                turnos_ocupados = {
                    asignacion_por_enfermera[e][dia] for e in preferencias if asignacion_por_enfermera[e][dia] is not None}
                # Encontrar turnos disponibles
                turnos_disponibles = set(
                    range(1, num_turnos_por_dia + 1)) - turnos_ocupados
                if turnos_disponibles:
                    turnos[dia] = turnos_disponibles.pop()
                else:
                    # Si no hay turnos disponibles, asignar el primer turno que no sea el día libre
                    for turno_potencial in range(1, num_turnos_por_dia + 1):
                        if turno_potencial != turnos[dia_libre - 1]:
                            turnos[dia] = turno_potencial
                            break

    return asignacion_por_enfermera


# get args
args = sys.argv

if len(sys.argv) == 1:
    print("No se ha ingresado el nombre del archivo de excel")
    sys.exit()
workbook_name = args[1]
# Generar la asignación de turnos con la función modificada
preferencias, dias_libres, enfermeras_por_turno = leer_datos_excel(
    workbook_name)
numero_total_enfermeras = len(preferencias)
numero_de_turno_por_dia = len(enfermeras_por_turno)
num_dias_total = num_dias = len(next(iter(preferencias.values())))
asignacion_por_enfermera = generar_asignacion_turnos_round_robin(
    preferencias, dias_libres, enfermeras_por_turno)


def generar_asignacion_turnos(num_dias, num_turnos_por_dia, num_enfermeras_por_turno, num_enfermeras):
    # Crear un arreglo tridimensional para la asignación de turnos
    asignacion = [[[0 for _ in range(num_enfermeras_por_turno[turno])] for turno in range(
        num_turnos_por_dia)] for _ in range(num_dias)]
    dias_trabajados = {enfermera: 0 for enfermera in range(
        1, num_enfermeras + 1)}  # Días trabajados por enfermera

    # Generar la asignación de turnos
    for dia in range(num_dias):
        for turno in range(num_turnos_por_dia):
            enfermeras_disponibles = list(range(1, num_enfermeras + 1))

            # Evitar que una enfermera trabaje más de un turno en el mismo día
            for turno_previo in range(turno):
                enfermeras_disponibles = [
                    enf for enf in enfermeras_disponibles if enf not in asignacion[dia][turno_previo]]
            if dia > 0 and turno == 0:
                enfermeras_disponibles = [
                    enf for enf in enfermeras_disponibles if enf not in asignacion[dia - 1][-1]]

            # Asignar enfermeras al turno actual
            if turno == 0 and dia < 6:
                num_enfermeras_asignar = num_enfermeras_por_turno[turno]
            else:
                num_enfermeras_asignar = num_enfermeras_por_turno[turno]

            num_enfermeras_asignar = min(
                num_enfermeras_asignar, len(enfermeras_disponibles))
            if num_enfermeras_asignar > 0:
                asignacion_turno_actual = random.sample(
                    enfermeras_disponibles, num_enfermeras_asignar)
                asignacion[dia][turno] = asignacion_turno_actual
                for enf in asignacion_turno_actual:
                    dias_trabajados[enf] += 1

    return asignacion


# Parámetros del problema
num_enfermeras = numero_total_enfermeras
num_dias = 7
num_turnos_por_dia = 3
num_enfermeras_por_turno = enfermeras_por_turno  # Número de enfermeras por turno
# Ejemplo de preferencias de días libres de las enfermeras
preferencias_dias_libres = dias_libres

# Función de aptitud


def calcular_fitness(asignacion, preferencias_dias_libres):
    fitness = 0  # Inicializar el valor de fitness en 0

    for enfermera, dia_preferido in preferencias_dias_libres.items():
        for dia in range(len(asignacion)):
            if dia + 1 == dia_preferido:
                # Si la enfermera tiene el día preferido libre, aumentar el fitness
                turno_del_dia = asignacion[dia][0]
                if enfermera in turno_del_dia:
                    fitness += 1
                turno_del_dia = asignacion[dia][1]
                if enfermera in turno_del_dia:
                    fitness += 1
                turno_del_dia = asignacion[dia][2]
                if enfermera in turno_del_dia:
                    fitness += 1

    return fitness


def tiene_elemento_repetido(arr, elemento):
    frecuencia = 0

    for item in arr:
        if item == elemento:
            frecuencia += 1
            if frecuencia > 1:
                return True

    return False


def reparar_cromosoma(individuo, num_enfermeras):
    dias_trabajados = {enfermera: 0 for enfermera in range(
        1, num_enfermeras + 1)}  # Días trabajados por enfermera

    # Llenar el rastreo de días trabajados
    for dia in individuo:
        for turno in dia:
            for enfermera in turno:
                dias_trabajados[enfermera] += 1

    for dia in range(len(individuo)):
        for turno in range(len(individuo[dia])):
            for idx, enfermera in enumerate(individuo[dia][turno]):
                r1 = tiene_elemento_repetido(individuo[dia][turno], enfermera)
                r2 = r3 = False
                if dia != 0 and turno == 0:
                    r2 = enfermera in individuo[dia - 1][2]
                if turno == 1:
                    r3 = enfermera in individuo[dia][0]
                elif turno == 2:
                    r3 = enfermera in individuo[dia][0] or enfermera in individuo[dia][1]

                # Comprobar si la enfermera ha trabajado 6 días ya
                r4 = dias_trabajados[enfermera] > 6

                while r1 or r2 or r3 or r4:
                    enfermera_propuesta = random.choice(
                        list(range(1, num_enfermeras + 1)))
                    r1 = tiene_elemento_repetido(
                        individuo[dia][turno], enfermera_propuesta)
                    if dia != 0 and turno == 0:
                        r2 = enfermera_propuesta in individuo[dia - 1][2]
                    if turno == 1:
                        r3 = enfermera_propuesta in individuo[dia][0]
                    elif turno == 2:
                        r3 = enfermera_propuesta in individuo[dia][0] or enfermera_propuesta in individuo[dia][1]
                    r4 = dias_trabajados[enfermera_propuesta] > 6

                    if not r1 and not r2 and not r3 and not r4:
                        individuo[dia][turno][idx] = enfermera_propuesta
                        # La enfermera original trabaja un día menos
                        dias_trabajados[enfermera] -= 1
                        # La nueva enfermera trabaja un día más
                        dias_trabajados[enfermera_propuesta] += 1

    return individuo


# Operadores genéticos
def seleccion(poblacion, aptitudes):
    # Seleccionar individuos basados en su aptitud
    seleccionados = random.choices(poblacion, weights=[
                                   1.0 / (aptitud + 1) for aptitud in aptitudes], k=len(poblacion))
    return seleccionados


def cruzar_padres(padre1, padre2, num_enfermeras):
    punto_de_corte = random.randint(0, len(padre1) - 1)
    descendiente1 = padre1[:punto_de_corte] + padre2[punto_de_corte:]
    descendiente2 = padre2[:punto_de_corte] + padre1[punto_de_corte:]
    reparar_cromosoma(descendiente1, num_enfermeras)
    reparar_cromosoma(descendiente2, num_enfermeras)
    return descendiente1, descendiente2


def mutar_cromosoma(cromosoma, num_enfermeras_por_turno, num_enfermeras):
    dia = random.randint(0, len(cromosoma) - 1)
    turno = random.randint(0, len(cromosoma[dia]) - 1)
    # Asegurarse de que la mutación cumple con el número de enfermeras requerido para el turno
    enfermeras_disponibles = list(range(1, num_enfermeras + 1))
    nueva_enfermera = random.choice(enfermeras_disponibles)
    cromosoma[dia][turno][0] = nueva_enfermera
    reparar_cromosoma(cromosoma, num_enfermeras)
    return cromosoma

# Algoritmo genético


def algoritmo_genetico(num_generaciones, tamano_poblacion, num_enfermeras_por_turno, num_enfermeras):
    poblacion_inicial = [generar_asignacion_turnos(
        num_dias, num_turnos_por_dia, num_enfermeras_por_turno, num_enfermeras) for _ in range(tamano_poblacion)]
    los_mejores = []

    for generacion in range(num_generaciones):
        aptitudes = [calcular_fitness(
            individuo, preferencias_dias_libres) for individuo in poblacion_inicial]

        padres = seleccion(poblacion_inicial, aptitudes)

        descendencia = []

        for i in range(0, len(padres), 2):
            hijo1, hijo2 = cruzar_padres(
                padres[i], padres[i + 1], num_enfermeras)
            descendencia.extend([hijo1, hijo2])

        for individuo in descendencia:
            individuo = mutar_cromosoma(
                individuo, num_enfermeras_por_turno, num_enfermeras)

        poblacion_inicial = descendencia

        fitness = calcular_fitness(
            poblacion_inicial[0], preferencias_dias_libres)

        mejor_individuo = poblacion_inicial[aptitudes.index(min(aptitudes))]

        los_mejores.append(mejor_individuo)
        if (calcular_fitness(mejor_individuo, preferencias_dias_libres) == 0):
            break

    aptitudes = [calcular_fitness(
        individuo, preferencias_dias_libres) for individuo in los_mejores]
    mejor_individuo = poblacion_inicial[aptitudes.index(min(aptitudes))]
    return mejor_individuo


# Parámetros del algoritmo genético
num_generaciones = 500
tamano_poblacion = 50
tasa_mutacion = 0.1

mejor_solucion = algoritmo_genetico(
    num_generaciones, tamano_poblacion, num_enfermeras_por_turno, num_enfermeras)


diccionario = {}
for dia in range(num_dias):
    diccionario[dia + 1] = {}
    for turno in range(num_turnos_por_dia):
        diccionario[dia + 1][turno + 1] = mejor_solucion[dia][turno]

print(json.dumps(diccionario))
sys.stdout.flush()
